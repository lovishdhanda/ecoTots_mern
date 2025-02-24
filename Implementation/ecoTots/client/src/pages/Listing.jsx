import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaTshirt,
  FaVenusMars,
  FaShare,
} from 'react-icons/fa';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const params = useParams();
    useEffect(() => {
      const fetchListing = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/listing/get/${params.listingId}`);
          const data = await res.json();
          if (data.success === false) {
            setError(true);
            setLoading(false);
            return;
          }
          setListing(data);
          setLoading(false);
          setError(false);
        } catch (error) {
          setError(true);
          setLoading(false);
        }
      };
      fetchListing();
    }, [params.listingId]);
    console.log(loading);

    return (
        <main>
          {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
          {error && (
            <p className='text-center my-7 text-2xl'>Something went wrong!</p>
          )}
          {listing && !loading && !error && (
            <div>
              <Swiper navigation>
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div
                      className='h-[550px]'
                      style={{
                        background: `url(${url}) center no-repeat`,
                        backgroundSize: 'cover',
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>


              <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
            {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          </div>
            <div>
            <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${listing.discountedPrice}
              </p>
              <p className='font-semibold'>Original Price - ${listing.price}</p>

            {/* <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p> */}

                <ul className='flex flex-wrap font-semibold text-sm items-center gap-4 sn:gap-6'>

                  <li className='flex items-center gap-1 whitespace-nowrap'>
                    <FaTshirt/>
                    {listing.category}
                  </li>
                
                  <li className='flex'>
                    <p>Brand : </p>
                    {' '}{listing.brand}
                  </li>

                  <li className='flex items-center gap-1 whitespace-nowrap'>
                    <FaVenusMars/>
                    {listing.gender}
                  </li>

                  <li className='flex'>
                    <p>Size : </p>
                    {' '}{listing.size}
                  </li>

                  <li className='flex'>
                    <p>Condition : </p> 
                    {' '}{listing.condition}
                  </li>
                </ul>

                <p className='text-slate-800'>
                  <span className='font-semibold text-black'>
                  Description - 
                    </span>{ listing.description}
                </p>
              </div>
              </div>
            </div>
          )}
        </main>
      );
    }