import React from 'react';
import { useLottie } from 'lottie-react'; 
import myAnimation from '../../assets/lottie/meatify-loading.json';

export function LoadingAnimation() {
    const options = {
        animationData: myAnimation,
        loop: true,
        autoplay: true,
    }

    const { View } = useLottie(options);

    return (
        <div style={{ width: '5rem', height: '2rem' }}>
            {View}
        </div>
    )
}