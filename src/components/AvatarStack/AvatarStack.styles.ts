import styled from "styled-components";

export const AvatarStackContainer = styled.div`
  display: flex;
  cursor: pointer;

  & > *:not(:first-child) {
    margin-left: -12px;
  }
`