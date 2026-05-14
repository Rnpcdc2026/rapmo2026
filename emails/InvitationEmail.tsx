import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

type Props = {
  firstName?: string | null;
  eventTitle: string;
  eventDates: string;
  eventLocation: string;
  deadline: string;
  inviteUrl: string;
  contactEmail: string;
};

export default function InvitationEmail({
  firstName,
  eventTitle,
  eventDates,
  eventLocation,
  deadline,
  inviteUrl,
  contactEmail,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Vous êtes invité·e à la {eventTitle}, les {eventDates} à {eventLocation}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={{ paddingBottom: 32, borderBottom: '1px solid #ede2cd', marginBottom: 40 }}>
            <Text style={{ fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, margin: 0, color: '#1a1612' }}>
              ● Rencontre Nationale Patrimoine
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(26,22,18,0.55)', margin: '4px 0 0 0' }}>Édition 2026</Text>
          </Section>

          <Section>
            <Text style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#c2410c', fontWeight: 500, margin: 0 }}>
              Invitation
            </Text>
            <Heading style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 38, lineHeight: 1.05, color: '#1a1612', margin: '20px 0 20px 0' }}>
              {firstName ? `${firstName}, deux jours` : 'Deux jours'} pour{' '}
              <em style={{ color: '#9a3412' }}>bâtir ensemble</em> le patrimoine.
            </Heading>
            <Text style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(26,22,18,0.75)', marginBottom: 16 }}>
              La Direction du Patrimoine Groupe a le plaisir de vous convier à la{' '}
              <strong>{eventTitle}</strong>, organisée les <strong>{eventDates}</strong> à{' '}
              <strong>{eventLocation}</strong>.
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(26,22,18,0.75)', marginBottom: 32 }}>
              Au programme : ateliers collaboratifs, tables rondes stratégiques, visites du patrimoine
              lyonnais et temps de networking entre les 150 à 200 collaborateurs du Groupe.
            </Text>

            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={inviteUrl}
                style={{
                  backgroundColor: '#1a1612',
                  color: '#fbf7f1',
                  padding: '16px 36px',
                  borderRadius: 50,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Confirmer ma présence →
              </Button>
            </Section>

            <Text style={{ fontSize: 13, color: 'rgba(26,22,18,0.6)', textAlign: 'center', marginTop: 16 }}>
              Clôture des inscriptions le <strong style={{ color: '#9a3412' }}>{deadline}</strong>
            </Text>
          </Section>

          <Hr style={{ borderColor: '#ede2cd', margin: '40px 0' }} />

          <Section>
            <Text style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(26,22,18,0.6)', margin: 0 }}>
              Une question ? Écrivez à{' '}
              <a href={`mailto:${contactEmail}`} style={{ color: '#c2410c' }}>{contactEmail}</a>
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(26,22,18,0.5)', marginTop: 24 }}>
              CDC Habitat — GIE Expertise &amp; Support · Direction du Patrimoine Groupe
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: '#fbf7f1', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', margin: 0, padding: 0 };
const container = { maxWidth: 580, margin: '0 auto', padding: '48px 32px', backgroundColor: '#fbf7f1' };
