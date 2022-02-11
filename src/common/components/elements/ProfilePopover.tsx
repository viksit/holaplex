/* eslint-disable react/display-name */
import styled from 'styled-components';
import Image from 'next/image';
import { forwardRef, useEffect, FC } from 'react';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletLabel, WalletPill } from '@/common/components/elements/WalletIndicator';
import { SolBalance } from '@/common/components/SolBalance';
import { DisconnectWalletButton } from '@/common/components/elements/Button';

export const ProfilePopover = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <PopoverBox ref={ref}>
      <PopoverBoxContents />
    </PopoverBox>
  );
});

type PopoverBoxContentsProps = {
  onViewProfile?: VoidFunction;
};

export const PopoverBoxContents: FC<PopoverBoxContentsProps> = ({ onViewProfile }) => {
  const [queryWalletProfile, walletProfile] = useWalletProfileLazyQuery();
  const { connected, publicKey } = useWallet();
  const { data: twitterHandle } = useTwitterHandle(publicKey);

  useEffect(() => {
    if (!twitterHandle) return;
    queryWalletProfile({
      variables: {
        handle: twitterHandle,
      },
    });
  }, [queryWalletProfile, twitterHandle]);

  const profilePictureUrl = connected
    ? walletProfile.data?.profile?.profileImageUrlHighres?.replace('_normal', '')
    : null;
  const textOverride = connected ? twitterHandle : null;

  return (
    <>
      <FirstRow>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <ProfilePicture
            width={PFP_SIZE}
            height={PFP_SIZE}
            src={profilePictureUrl ?? '/images/gradients/gradient-3.png'}
            alt="Profile Picture"
          />
          <div
            style={{
              marginLeft: 20,
            }}
          >
            <WalletPill
              onClick={onViewProfile}
              disableBackground
              textOverride={'View profile'}
              publicKey={publicKey}
            />
          </div>
        </div>
      </FirstRow>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 24,
        }}
      >
        <SolBalance />
        <WalletLabel />
      </div>
      <div
        style={{
          width: '100%',
        }}
      >
        <DisconnectWalletButton />
      </div>
    </>
  );
};

const PFP_SIZE = 80;

const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const PopoverBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px; // Since ANTD Popover Inner Content ist like 12x16px
`;

const ProfilePicture = styled(Image)`
  border-radius: 50%;
`;
