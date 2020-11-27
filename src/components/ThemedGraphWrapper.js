import styled from "styled-components";

const ThemedGraphWrapper = styled.div`
  height: ${({ theme }) =>
    theme.isInIframe
      ? `100vh`
      : `calc(100vh - ${theme.headerHeight}px - ${theme.searchBarHeight}px)`};
`;

export default ThemedGraphWrapper;
