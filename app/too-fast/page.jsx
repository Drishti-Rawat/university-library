import React from 'react';

const TooManyRequestsPage = () => {
  return (
    <>
    <div className=' root-container min-h-screen  flex flex-col justify-center items-center '>
 <div className="text-center ">
        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-wide">
          WHOA, SLOW DOWN THERE, SPEEDY!
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-400 text-lg leading-relaxed">
          Looks like you've been a little too eager. We've put a temporary pause on your 
          excitement. 😊 Chill for a bit, and try again shortly.
        </p>
      </div>
    </div>
     
    </>
  );
};

export default TooManyRequestsPage;