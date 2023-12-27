import ReactGA from "react-ga";
const reactGAEvent = (category, action) => {
  const payload = {
    category: category,
    action: JSON.stringify(action),
  };
  console.log(payload)
  ReactGA.event(payload);
};
export { reactGAEvent };