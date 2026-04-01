export default function LoadingSpin(){
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] w-full gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading Page....</p>
        </div>
    );

}