import styled from "styled-components";

export const Box = styled.div`
  background: #000;
  width: 100%;
  padding: 0px;
  color: #fff;
`;

export const CopyBox = styled.div`
  background: #000;
  width: 100%;
  text-align: center;
  padding: 30px 0;
  border-top: 1px solid #673ab7
`;

export const CopyBoxUp = styled.div`
  background: 'linear-gradient(-260deg, rgba(144,74,216,1) 23%, rgba(65,148,213,1) 92%)';
`;

export const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 40px 0;
  @media (max-width: 769px) {
    flex-direction: column;
    align-items: center;
	gap: 50px;
  }
`;

export const IconRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: 20px 0;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 20px; /* Adjusted margin for better spacing */
`;

export const FooterLink = styled.a`
  color: #fff;
  margin: 0 15px;
  font-size: 18px;
  text-decoration: none;

  &:hover {
    color: #8c46fa;
    transition: 200ms ease-in;
  }
`;



export const FooterImage = styled.img`
  width: 280px;
  height: auto;
  gap: 100px;
  margin-bottom: 20px;
`;

export const FooterImg = styled.img`
  width: 238px;
  height: auto;
  margin-top: -10px;
`;

export const Icon = styled.img`
  width: 40px;
  height: 40px;
  margin: 0 15px; /* Even spacing between icons */
`;

export const Heading = styled.h3`
  color: #8c46fa;
  margin-bottom: 20px;
  font-size: 24px;
`;

export const Text = styled.p`
  color: #fff;
  margin: 10px 0;
  font-size: 18px;
  text-align: center;
`;
