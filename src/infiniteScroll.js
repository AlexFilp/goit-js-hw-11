export const handleInfiniteScroll = handler => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endOfPage) {
    handler();
  }
};
