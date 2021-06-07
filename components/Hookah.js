import {useEffect} from "react";

export const useAsync = (effect, deps) =>
    useEffect(() => {
        effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
