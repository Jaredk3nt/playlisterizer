import styled from '@emotion/styled';

const Flex = styled('div')`
  display: flex;
  flex-direction: ${p => p.direction || 'row'};
  align-items: ${p => p.align || 'flex-start'};
  justify-content: ${p => p.justify || 'flex-start'};
  width: ${p => p.w || '100%'};
  height: ${p => p.h || '100%'};
`;

export default Flex;