const playSoundEffect = (sfx) => {
  const audio = new Audio(sfx);
  audio.muted = false;
  return audio.play();
};

export default playSoundEffect;
