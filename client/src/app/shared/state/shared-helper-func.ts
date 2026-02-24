export const shuffle = (arrayToShuffle: any[]) => {
  let workableArray = arrayToShuffle.slice();
  let currentIndex = workableArray.length, randomIndex;

  while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [workableArray[currentIndex], workableArray[randomIndex]] = [
          workableArray[randomIndex], workableArray[currentIndex]];
  }
  return workableArray;
}
