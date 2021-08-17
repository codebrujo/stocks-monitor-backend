import styled from 'styled-components';

const StyledFormContainer = styled.div`
    display: block;
    .inputfield {
        margin: 10px 0;
        display: flex;
        margin: 30px 0;
        &-caption {
            width: 140px;
            line-height: 25px;
            &-err {
                color: red;
                line-height: 25px;
                margin-left: 10px;
            }
    }
        &-input {
            border-color: rgb(18, 18, 128);
            height: 20px;
            width: 150px;
        }
    }

    .button-submit {
        display: block;
        margin: 0 auto;
        appearance: none;
        border: 0;
        border-radius: 5px;
        background: #3f51b5;
        color: #fff;
        padding: 8px 16px;
        font-size: 16px;
        min-width: 100px;
        &:hover {
            background: #303f9f;
        }
        &:focus {
            outline: none;
            box-shadow: 3px 5px 3px #baccf5;
        }
    }
`;

export default StyledFormContainer;
