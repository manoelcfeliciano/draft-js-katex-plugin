import React, { useEffect, useRef } from 'react';
import * as types from './types';
import { usePrevious } from 'use-hooks';
import katex from 'katex';

const KatexOutput: types.FC = (props) => {
	// Refs
	const prevValue = usePrevious(props.value);
	const wrapperRef = useRef<HTMLDivElement>();

	/**
	 * Render the initial LateX content on mount
	 */
	useEffect(() => {
		update();
	}, []);

	/**
	 * Update the rendered content on value change
	 */
	useEffect(() => {
		if (prevValue !== props.value) {
			update();
		}
	}, [props.value]);

	/**
	 * Update the LateX code to be rendered
	 *
	 * @param {void}
	 *
	 * @return {void}
	 */
	const update = (): void => {
		katex.render(props.value, wrapperRef.current, {
			displayMode: props.displayMode,
		});
	};

	return <div ref={wrapperRef} onClick={props.onClick} />;
};

export default KatexOutput as React.FC<types.IKatexOutputProps>;
