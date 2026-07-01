import "./loading.css";
import PawLogo from "./PawLogo";

const Loader = ({ label = "Loading" }) => (
  <div className="pc-loader-overlay" role="status" aria-live="polite" aria-label={label}>
    <div className="pc-loader">
      <div className="pc-loader__rings">
        <span className="pc-loader__ring pc-loader__ring--track" />
        <span className="pc-loader__ring pc-loader__ring--outer" />
        <span className="pc-loader__ring pc-loader__ring--inner" />
        <PawLogo className="pc-loader__logo" size={50} />
      </div>
      <span className="pc-loader__label">
        {label}
        <span className="pc-loader__dots" />
      </span>
    </div>
  </div>
);

export default Loader;
