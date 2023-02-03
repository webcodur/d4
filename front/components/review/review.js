import { useState, useEffect } from "react";
import Modal_Pw_Del from "./modal/Modal_Pw_Del";
import Modal_Pw_Update from "./modal/Modal_Pw_Update";
import Modal_Ban from "./modal/Modal_Ban";
import Modal_Ask from "./modal/Modal_Ask";

import filtering from "./functions/filtering.js";
import allReviewClicked from "./functions/allReviewClicked.js";

import Load_Dong from "./functions/Load_Dong.js";
import Load_Gu from "./functions/Load_Gu";

// import nameId from '../../Id_book/nameId.json'
import axios from "axios";
import ReviewList from "./reviewList";
import ReviewNone from "./reviewNone";
import ReviewEditForm from "./reviewEditForm";
import ReviewAddForm from "./reviewAddForm";

// styled
import Title from "../titleStyles";
import { SmallBtn, ReviewBtn } from "../../styles/btnStyles";

// react-icons
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiFillWechat } from "react-icons/ai";

//map
import seoulMap from "../../data/map/seoul.json";

const Review = ({ currentState, setCurrentState, setModal, modal }) => {
  const serverUrl = "http://kdt-ai5-team04.elicecoding.com:5001";

  // 값 조정 관련
  const [list, setList] = useState([]);
  const [reviewCnt, setReviewCnt] = useState([0, 0, 0, 0]); // [all, lv1, lv2, lv3]
  const [reviewObj, setReviewObj] = useState(undefined);
  const [avgIdx, setAvgIdx] = useState(undefined);
  const [more, setMore] = useState(0);
  const [limit, setLimit] = useState(71);
  const [lv, setLv] = useState(-1);

  // 토글 관련
  const [isEditing, setIsEditing] = useState(false);
  const [dongList, setDongList] = useState([]);
  const [listChanged, setListChanged] = useState(false); // toggle
  const [reviewType, setReviewType] = useState("default"); // or lv
  const [filterClicked, setFilterClicked] = useState(false);
  const [basic, setBasic] = useState(true);
  const [typeChanged, setTypeChanged] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [dongListChanged, setDongListChanged] = useState(false);
  const [filterIcon, setFilterIcon] = useState(false);
  const openIsEditing = () => {
    setIsEditing(true);
  };
  const closeIsEditing = () => {
    setIsEditing(false);
  };

  const [editDongInfo, setEditDongInfo] = useState(undefined);

  // ***** [GET] ***** //
  // 0. 구에 따른 동 목록 받기
  const getDongsByGuId = async () => {
    try {
      await axios
        .get(`${serverUrl}/location/gus/${currentState.guId}/dongs`)
        .then((res) => {
          setDongList(res.data.dongs);
          setDongListChanged(true);
        });
    } catch {
      console.log("getReview 실패");
    }
  };

  // 1. 기본 : 리뷰수 + 리뷰목록 + 평균 소음 인덱스 구하기
  useEffect(() => {
    getDongsByGuId();
    setMore((prev) => 0);

    if (basic == true) {
      // 1-1. 구 리뷰 [개수,평균,목록] 구함
      if (currentState.currentView == "gu") {
        Load_Gu(
          currentState,
          more,
          setList,
          setReviewCnt,
          reviewCnt,
          setAvgIdx
        );
      }
      // 1-2. 동 리뷰 [개수,평균,목록] 구함
      if (currentState.currentView == "dong") {
        Load_Dong(
          currentState,
          more,
          setList,
          setReviewCnt,
          reviewCnt,
          setAvgIdx
        );
      }
      setBasic(false);
    }
  }, [currentState.currentView, currentState.guId, currentState.clickSpotId]);

  useEffect(() => {
    getDongsByGuId();

    if (basic == false) {
      // 필터된 구동 리뷰 정보 구함
      if (reviewType == "filter") {
        filtering(
          currentState,
          more,
          setList,
          setReviewCnt,
          reviewCnt,
          setAvgIdx,
          lv
        );
      }
      // more 반영한 반영 GET 실행 (디폴트 함수 실행)
      if (reviewType == "default") {
        allReviewClicked(
          currentState,
          more,
          setList,
          setReviewCnt,
          reviewCnt,
          setAvgIdx
        );
      }
    }
  }, [filterClicked, basic, more, currentState.clickSpotId]);

  //***** [더보기] *****//
  const toggleEllipsis = (str, limit) => {
    return {
      string: str.slice(0, limit),
      isShowMore: str.length > limit,
    };
  };
  const onClickMore = (str) => () => {
    setLimit(str.length);
  };

  //***** [뒤로가기] *****//
  const back = (currentState, setCurrentState) => {
    if (currentState.currentView === "gu") {
      setCurrentState({
        ...currentState,
        currentView: "ranking",
        zoom: 2,
        map: seoulMap,

        guId: "",
        guName: "",
        clickSpotId: "",
        clickedName: "",
        center: [126.986, 37.561],
      });
    }
    if (
      currentState.currentView === "dong" ||
      currentState.currentView === "info"
    ) {
      const gu = currentState.guName;
      setCurrentState({
        ...currentState,
        currentView: "gu",
        clickSpotId: "",
        clickedName: gu,
      });
    }
  };

  return (
    <>
      <Title>
        <div className="title">
          <button
            className="back"
            onClick={() => {
              back(currentState, setCurrentState);
            }}
          >
            <AiOutlineArrowLeft />
          </button>
          <h3>
            {currentState.guName}{" "}
            {currentState.clickSpotId && currentState.clickedName}{" "}
            <span>리뷰</span>
          </h3>
        </div>

        <div>
          <div className="reviewAll">
            <button>
              <AiFillWechat
                onClick={() => {
                  // setReviewType('default')
                  allReviewClicked(
                    currentState,
                    more,
                    setList,
                    setReviewCnt,
                    reviewCnt,
                    setAvgIdx
                  );
                  setFilterIcon((prev) => false);
                }}
              />
            </button>
            {/* 한번에 모든 게시글을 불러오지 않기 때문에 모든 모든 게시글 개수를 불러오는 api 설정 필요 */}
            <span>{reviewCnt[0]}</span>
          </div>
        </div>
      </Title>

      {reviewCnt[0] == 0 ? (
        <ReviewNone setIsWriting={setIsWriting} />
      ) : (
        <ReviewList
          list={list}
          limit={limit}
          toggleEllipsis={toggleEllipsis}
          onClickMore={onClickMore}
          setModal={setModal}
          setReviewObj={setReviewObj}
          setIsWriting={setIsWriting}
          isWriting={isWriting}
          setMore={setMore}
          currentState={currentState}
          more={more}
          setList={setList}
          reviewType={reviewType}
          setReviewType={setReviewType}
          reviewCnt={reviewCnt}
          avgIdx={avgIdx}
          typeChanged={typeChanged}
          lv={lv}
          setLv={setLv}
          dongList={dongList}
          dongListChanged={dongListChanged}
          setReviewCnt={setReviewCnt}
          setAvgIdx={setAvgIdx}
          setBasic={setBasic}
          setFilterIcon={setFilterIcon}
          filterIcon={filterIcon}
        />
      )}
      <ReviewBtn>
        <button
          onClick={() => {
            setIsWriting(true);
          }}
        >
          소음 리뷰 쓰러가기
        </button>
      </ReviewBtn>

      {/* 작성불가 안내 */}
      {modal == "ban" && <Modal_Ban setModal={setModal} />}

      {/* 삭제 확인 */}
      {modal == "chk" && <Modal_Ask setModal={setModal} />}

      {/* 비번확인 AND 삭제 */}
      {modal == "pw_delete" && (
        <Modal_Pw_Del
          setModal={setModal}
          reviewObj={reviewObj}
          reviewType={reviewType}
          currentState={currentState}
          more={more}
          setList={setList}
          setReviewCnt={setReviewCnt}
          reviewCnt={reviewCnt}
          setAvgIdx={setAvgIdx}
          lv={lv}
        />
      )}

      {/* 비번확인 FOR 수정 */}
      {modal == "pw_update" && (
        <Modal_Pw_Update
          setModal={setModal}
          reviewObj={reviewObj}
          openIsEditing={openIsEditing}
          setEditDongInfo={setEditDongInfo}
        />
      )}

      {/* 수정 폼 */}
      {isEditing && (
        <ReviewEditForm
          currentReview={reviewObj}
          closeIsEditing={closeIsEditing}
          editDongInfo={editDongInfo}
          reviewType={reviewType}
          currentState={currentState}
          more={more}
          setList={setList}
          setReviewCnt={setReviewCnt}
          reviewCnt={reviewCnt}
          setAvgIdx={setAvgIdx}
          lv={lv}
        />
      )}

      {/* 입력 폼 */}
      {isWriting && (
        <ReviewAddForm
          setIsWriting={setIsWriting}
          currentState={currentState}
          setModal={setModal}
          reviewType={reviewType}
          more={more}
          setList={setList}
          setReviewCnt={setReviewCnt}
          reviewCnt={reviewCnt}
          setAvgIdx={setAvgIdx}
          lv={lv}
        />
      )}
    </>
  );
};
export default Review;
