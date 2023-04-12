import { useState, useRef, FC } from 'react';
import { toast } from 'react-toastify';

interface Props {}

const APIKey: FC<Props> = () => {
  const [showModal, setshowModal] = useState(false);
  const [randonkeys, setRandomKeys] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const displayModal = () => {
    setshowModal(!showModal);
  };
  const textRef = useRef<HTMLTextAreaElement>(null);

  const showToastMessage = () => {
    toast.success('Text copied successfully', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };
  function handleCopy() {
    if (textRef.current) {
      textRef.current.select();
      document.execCommand('copy');
      setshowModal(!showModal);
      showToastMessage();
    }
  }

  const fetchkey = () => {
    setIsLoading(true);
    fetch('/api/auth/apikey')
      .then((response) => response.json())
      .then((data) => {
        setRandomKeys(data.apiKey);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  };
  return (
    <div>
      <aside className=" min-h-[200px] w-[450px]  bg-[#fbfbfe] shadow ">
        <figure className="p-[2rem]">
          <textarea
            ref={textRef}
            defaultValue={!isLoading ? randonkeys : 'loading....'}
            className="border-[1px] outline-none border-[#320a8d] w-full px-[1rem] py-[0.5rem] rounded-md h-[40px]"
          />
          <div className="flex items-center justify-between mt-[2rem]">
            <button
              className="bg-[white] px-[2rem] py-[0.5rem] border-[#320a8d] border-[2px] rounded-md text-[#320a8d] font-bold"
              onClick={fetchkey}
            >
              {' '}
              GENERATE NEW KEY
            </button>
            <button
              className="bg-[#320a8d] px-[2rem] py-[0.5rem] border-none rounded-md text-white font-bold"
              onClick={handleCopy}
            >
              COPY
            </button>
          </div>
        </figure>
      </aside>
    </div>
  );
};

export default APIKey;
