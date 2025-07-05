import { Authenticator, View, Image, Heading, useTheme } from '@aws-amplify/ui-react';

interface AuthenticatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthenticatorModal({ isOpen, onClose }: AuthenticatorModalProps) {
  const { tokens } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <View
        backgroundColor="white"
        borderRadius="medium"
        padding="large"
        maxWidth="400px"
        width="90%"
        maxHeight="90%"
        overflow="auto"
      >
        <View textAlign="right" marginBottom="medium">
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              color: '#666'
            }}
          >
            ×
          </button>
        </View>
        <Authenticator
          components={{
            Header() {
              return (
                <View textAlign="center" backgroundColor="#F5DEB3" padding="15px">
                  <Image
                    alt="logo"
                    borderRadius={tokens.radii.xl}
                    width="100px"
                    src="/maskable.png"
                  />
                  <Heading
                    fontSize={tokens.fontSizes.xl}
                    color={tokens.colors.primary[90]}
                  >
                    jpc.eats
                  </Heading>
                </View>
              );
            },
          }}
        >
          {() => {
            // Close modal when authentication is successful
            onClose();
            return <div />;
          }}
        </Authenticator>
      </View>
    </div>
  );
}
