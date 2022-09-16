const playSoundEffect = (sfx) => {
  const audio = new Audio(sfx);
  return audio.play();
};

export default playSoundEffect;
