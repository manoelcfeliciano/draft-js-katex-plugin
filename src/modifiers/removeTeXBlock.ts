import { Modifier, EditorState, SelectionState } from 'draft-js';

export default (editorState: EditorState, blockKey: string) => {
  let content = editorState.getCurrentContent();
  let targetRange: SelectionState;
  const newSelection = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: 0,
  });
  const afterKey = content.getKeyAfter(blockKey);
  const afterBlock = content.getBlockForKey(afterKey);

	/** 
	 * Only if the following block the last with no text then the whole block
	 * should be removed. Otherwise the block should be reduced to an unstyled block
	 * without any characters.
	 */
  const conditions: Array<() => boolean> = [
    () => Boolean(afterBlock),
    () => afterBlock.getType() === 'unstyled',
    () => afterBlock.getLength() === 0,
    () => afterBlock === content.getBlockMap().last()
  ];

  if (conditions.every(c => c())) {
    targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: afterKey,
      focusOffset: 0,
    });
  } else {
    targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 1,
    });
  }

  // Change the blocktype and remove the characterList entry with the sticker
  content = Modifier.setBlockType(content, targetRange, 'unstyled');
  content = Modifier.removeRange(content, targetRange, 'backward');

  // Force to new selection
  const newState = EditorState.push(editorState, content, 'remove-range');
  return EditorState.forceSelection(newState, newSelection);
};
