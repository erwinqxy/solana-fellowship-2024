import Products from '../components/Products'
import SiteHeading from '../components/SiteHeading'
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import CouponBook from '../components/CouponBook';

export default function HomePage() {
    return (
      <div className="m-auto flex max-w-4xl flex-col items-stretch gap-8 pt-24">
        <SiteHeading>Iphone Sale!!</SiteHeading>
        <Products submitTarget="/checkout" enabled={true} />{' '}
      </div>
    )
}
