import Image from 'next/image';

export default function Brand({title='Success On The Spectrum',subtitle='Parsippany'}) {
  return <div className="brand">
    <Image className="brand-logo" src="/sos-logo.svg" width={180} height={82} alt="Success On The Spectrum logo" priority/>
    <span><strong>{title}</strong><small>{subtitle}</small></span>
  </div>;
}
