import styled from "styled-components";

export const Wrapper = styled.div`
    position: absolute;
    padding: 20px 15px 20px 15px;
    background-color: white;
    border-radius: 50px;
    
    z-index: 500;
    top: 50%;
    left: 10px;
    transform: translate(0%, -50%);

    .active {
        a {
            color: black;
        }
    }

    .inactive {
        a {
            color: grey;
        }
    }
`;