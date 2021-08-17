import styled from 'styled-components';

const StyledHeader = styled.header`
    margin: 0 auto;
    display: flex;
    justify-content: center;
    font-family: 'roboto';
    .summary {
        &-block {
            background-color: #07072a;
            min-width: 33%;
            max-height: 190px;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            span {
                padding: 20px 50px;
            }
            span:first-child {
                font-size: 16px;
            }   
            span:nth-child(2) {
                font-size: 24px;
            }
            span:last-child {
                font-size: 18px;
            }
        }
        &-block:nth-child(2):before,
        &-block:last-child:before {
            content: "";
            position: absolute;
            top: 20px;
            left: 7px;
            width: 1px;
            height: 148px;
            border-left: 1px solid #ffe9c8;
        }
    }
`;

export default StyledHeader;
