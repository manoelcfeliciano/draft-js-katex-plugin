import styled from 'styled-components';

const InputWrapper = styled.div`
	font-family: 'Helvetica', sans-serif;
	font-weight: 200;
`;

const EditorPanelWrapper = styled.div`
	text-align: center;
	cursor: pointer;
	margin: 20px auto;
	transition: background-color 0.2s fade-in-out;
	user-select: none;
	-webkit-user-select: none;
`;

export default {
	InputWrapper,
	EditorPanelWrapper,
};
