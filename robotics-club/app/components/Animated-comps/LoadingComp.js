import ShinyText from "./ShinyText";


const LoadingComp = ()=>{
    return (
        <div className="text-[--text-muted] w-full flex flex-col items-center justify-center z-40">
            <div className="w-[50px] h-[50px] rounded-full border-r-2 border-[var(--primary)] animate-spin">
                
            </div>

                
                <ShinyText text="Iru macha!" className="mt-4"/>

        
        </div>
    )
}

export default LoadingComp;