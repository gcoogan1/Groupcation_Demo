import styled from "styled-components";

interface GRouteProps {
	type: string;
}

export const GRouteContainer = styled.div`
	display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  align-items: center;
`;

export const TopLine = styled.div<GRouteProps>`
  width: 1px;
  height: 12px;
  background: linear-gradient(
    to top,
    ${({ type }) => type} 0%,
    transparent 100%
  );
`;

export const BottomLine = styled.div<GRouteProps>`
  width: 1px;
  height: 12px;
  background: linear-gradient(
    to bottom,
    ${({ type }) => type} 0%,
    transparent 100%
  );
`;
