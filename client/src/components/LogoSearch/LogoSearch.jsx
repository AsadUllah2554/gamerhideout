import React,{useState} from 'react'
import Logo from '../../assets/images/logo.png'
import './Logosearch.css'



const LogoSearch = () => {
  const [email, setEmail] = useState('')
  return (
    <div className="LogoSearch">
      <img src={Logo} alt="" className="LogoImage" />
      {/* <img src={Logo} alt="" style={{ width: '100px', height: '60px' }} /> */}
      <div className="Search">
        <input type="text" placeholder="#Find" value={email} 
        onChange={(e)=>setEmail(e.target.value)}
        />
        {/* <div className="s-icon">
          <UilSearch /> 
        </div> */}
      </div>
    </div>
  );
};

export default LogoSearch;
