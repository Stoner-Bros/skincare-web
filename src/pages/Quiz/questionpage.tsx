import { useState } from "react";

export default function Questionpage() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
    };

    return (
        <div className="flex justify-center bg-pink-50 py-10">
            <div className="bg-white shadow-lg rounded-2xl p-12 w-[1200px] h-[700px] flex flex-col justify-center border border-green-300">
                <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div className="bg-green-400 h-2.5 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                    <p className="text-center font-semibold">1/5</p>
                </div>
                <h2 className="text-lg font-semibold mb-2">How does your skin feel a few hours after washing your face?</h2>
                <p className="text-sm text-gray-500 mb-4">Point: 20</p>
                <div className="space-y-3">
                    {["Very oily all over", "Somewhat oily in T-zone only", "Normal and balanced", "Dry and tight"].map(
                        (option) => (
                            <button
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className={`w-full p-4 border rounded-lg hover:bg-green-100 transition ${selectedOption === option ? "bg-green-200" : ""
                                    } border-green-300`}
                            >
                                {option}
                            </button>
                        )
                    )}
                </div>
                <button
                    className="mt-4 w-[200px] p-3 rounded-full bg-green-200 text-green-700 font-semibold mx-auto block shadow-md"
                    disabled={!selectedOption}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
