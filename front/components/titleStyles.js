import styled from "styled-components";

const Title = styled.div`

  ${({ theme }) => theme.common.flexCenter};
  justify-content: space-between;

  height: ${({ alignItem }) => alignItem === 'flexStart' ? '100px' : '68px'};
  padding: 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey1};

  .title{
    ${({ theme }) => theme.common.flexCenter}
    align-items:  ${({ alignItem }) => alignItem !== 'flexStart' || 'flex-start'};

    .back{
      margin-right: 12px;
      svg{
        width: 28px;
        height: auto;
        color: #333;
      }
    }
  
    h3{
      font-weight: 700;
      font-size: 24px;
      span{
        color: ${({ theme }) => theme.colors.main};
      }
    }
    h4{
      margin-top: 12px;
      color: ${({ theme }) => theme.colors.main};
    }
  }

  // ranking 수치순, 글자순
  .toggleList{
    ${({ theme }) => theme.common.flexCenter}
    li{
      ${({ theme }) => theme.common.flexCenter}
      color: ${({ theme }) => theme.colors.grey1};
      &+li{margin-left: 16px;}
      

      button{
        width: 24px;
        height: 24px;
        margin-left: 8px;
        background: ${({ theme }) => theme.colors.grey4};
        border-radius: 2px;
      }

      &.active{
        color: ${({ theme }) => theme.colors.main};
        button{
          background: ${({ theme }) => theme.colors.main};
          color: #fff;
        }
      }
    }
  }

  // 전체리뷰 확인 버튼
  .reviewAll{
    ${({ theme }) => theme.common.flexCenter};
    flex-direction: column;

    button{
      svg{
        width: 40px;
        height: 32px;
        color: ${({ theme }) => theme.colors.main};
      }
    }
    span {
      color: ${({ theme }) => theme.colors.main};
    }
  }
  `;
export default Title;