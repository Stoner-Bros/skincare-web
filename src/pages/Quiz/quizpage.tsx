export default function QuizPage() {
    // const navigationLinks = [
    //     {
    //         path: "/about",
    //         label: "VỀ CHÚNG TÔI",
    //     },
    //     {
    //         path: "/services",
    //         label: "DỊCH VỤ LÀM ĐẸP",
    //     },
    //     {
    //         path: "/phun-xam",
    //         label: "PHUN XĂM THẨM MỸ",
    //     },
    //     {
    //         path: "/doctor",
    //         label: "BÁC SĨ",
    //     },
    //     {
    //         path: "/tips",
    //         label: "TIPS LÀM ĐẸP",
    //     },
    //     {
    //         path: "/franchise",
    //         label: "NHƯỢNG QUYỀN",
    //     },
    // ];

    return (

        <div className='w-full min-h-screen bg-white'>
            <div className='text-center'>
                <h2 className='text-3xl font-bold mb-2'>
                    Tham gia các bài kiểm tra về da của chúng tôi
                </h2>
                <h2 className='text-lg'>
                    Để hiểu hơn về da của bạn đang cần được chăm sóc như thế nào
                </h2>
            </div>
            <div className='w-full bg-white flex'>
                <div className='w-7/12 p-4 flex flex-col items-end'>

                    <div className="w-[950px] h-[200px] bg-white rounded-2xl shadow-lg flex items-center border border-pink-300 mb-5"  >
                        <img src="/tesst.webp" alt="MD-CODE" className="aspect-[11/9] h-[200px] object-cover rounded-xl" />
                        <div className="h-[200px] px-4 py-2 flex flex-col grow">
                            <h3 className="text-pink-500 font-semibold text-lg mb-2">MD-CODE</h3>
                            <p className="text-gray-600 text-sm tracking-widest">Công nghệ MD-DYNAMIC CODE tái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất có thể cho bạn để làm việc nhanh nhất. Công nghệ MD-DYNAMIC CODE cái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất</p>
                            <button className="border border-green-500 text-white bg-green-500 px-3 py-1 rounded-md text-sm shadow-md hover:bg-green-600 w-fit mt-3">
                                Start Quiz
                            </button>


                        </div>
                    </div>
                    <div className="w-[950px] h-[200px] bg-white rounded-2xl shadow-lg flex items-center border border-pink-300 mb-5"  >
                        <img src="/tesst.webp" alt="MD-CODE" className="aspect-[11/9] h-[200px] object-cover rounded-xl" />
                        <div className="h-[200px] px-4 py-2 flex flex-col grow">
                            <h3 className="text-pink-500 font-semibold text-lg mb-2">MD-CODE</h3>
                            <p className="text-gray-600 text-sm tracking-widest">Công nghệ MD-DYNAMIC CODE tái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất có thể cho bạn để làm việc nhanh nhất. Công nghệ MD-DYNAMIC CODE cái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất
                            </p>
                        </div>
                    </div>
                    <div className="w-[950px] h-[200px] bg-white rounded-2xl shadow-lg flex items-center border border-pink-300 mb-5"  >
                        <img src="/tesst.webp" alt="MD-CODE" className="aspect-[11/9] h-[200px] object-cover rounded-xl" />
                        <div className="h-[200px] px-4 py-2 flex flex-col grow">
                            <h3 className="text-pink-500 font-semibold text-lg mb-2">MD-CODE</h3>
                            <p className="text-gray-600 text-sm tracking-widest">Công nghệ MD-DYNAMIC CODE tái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất có thể cho bạn để làm việc nhanh nhất. Công nghệ MD-DYNAMIC CODE cái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất
                            </p>
                        </div>
                    </div>
                    <div className="w-[950px] h-[200px] bg-white rounded-2xl shadow-lg flex items-center border border-pink-300 mb-5"  >
                        <img src="/tesst.webp" alt="MD-CODE" className="aspect-[11/9] h-[200px] object-cover rounded-xl" />
                        <div className="h-[200px] px-4 py-2 flex flex-col grow">
                            <h3 className="text-pink-500 font-semibold text-lg mb-2">MD-CODE</h3>
                            <p className="text-gray-600 text-sm tracking-widest">Công nghệ MD-DYNAMIC CODE tái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất có thể cho bạn để làm việc nhanh nhất. Công nghệ MD-DYNAMIC CODE cái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất
                            </p>
                        </div>
                    </div>



                </div>
                <div className='w-5/12 p-4 sticky'>
                    <div className='w-[650px] h-[600px] bg-white p-4 rounded-2xl shadow-lg border border-green-300'>
                        <h3 className='text-xl font-bold mb-2'>Quiz History</h3>
                        <div className='bg-white p-2 mb-2 rounded-2xl shadow-lg border border-green-300 border-l-8'>
                            <h4 className='font-bold'>Skin Type Assessment</h4>
                            <p>Score: <span className='text-red-500'>Not Attempted</span></p>
                            <p>Date Taken: 3/12/2025</p>
                        </div>
                        <div className='bg-white p-2 mb-2 rounded-2xl shadow-lg border border-green-300 border-l-8'>
                            <h4 className='font-bold'>Skin Type Assessment</h4>
                            <p>Score: <span className='text-red-500'>Not Attempted</span></p>
                            <p>Date Taken: 3/10/2025</p>
                        </div>
                        <div className='bg-white p-2 mb-2 rounded-2xl shadow-lg border border-green-300 border-l-8'>
                            <h4 className='font-bold'>Skin Type Assessment</h4>
                            <p>Score: <span className='text-red-500'>Not Attempted</span></p>
                            <p>Date Taken: 3/10/2025</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
