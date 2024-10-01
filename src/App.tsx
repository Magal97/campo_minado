import "./css/app.css";
import {Board} from './Board'

export const App = () => {
  return (
    <div className="container">
      <Board size={10} />
    </div>
  );
}

