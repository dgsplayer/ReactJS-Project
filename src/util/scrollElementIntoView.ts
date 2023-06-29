const scrollElementIntoView = (element: HTMLElement) => {
  element.scrollIntoView({ behavior: "smooth", block: "center" });
};

export default scrollElementIntoView;
