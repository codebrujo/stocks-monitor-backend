import styled from 'styled-components';

const StyledList = styled.ul `
    margin: 10% 0 0 0;
    box-sizing: border-box;
    list-style: none;
    color: #96a5be;
    li {
        min-width: 135px;
        min-height: 30px;
        display: flex;
        align-items: center;
        a {
            font-size: 16px;
            padding: 10px;
            text-decoration: none;
            color: inherit;
            font-family: 'roboto'
        }
    }
    .normal-item {
        &:hover {
            background-color: #f7f9fb;
        }
        &:hover a {
            color: #517fcf;
        }
    }
    .selected-item {
        background-color: #6084a8;
        color: #f7f9fb;
        &:hover {
            background-color: #6084a8;
        }
        &:hover a {
            color: #f7f9fb;
        }
    }
`;

export default StyledList;