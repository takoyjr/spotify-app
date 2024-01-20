import '../css/Navbar/navbar.css'
import { Header } from './Navbar/Header';
import { Body } from './Navbar/Body';

export function Navbar() {
  return (
      <div className="sideBar-width text-white rounded-lg flex flex-col justify-between mr-1 mob mob-navbar mob-round mm">
          <Header/>
          <Body />
      </div>
  );
}