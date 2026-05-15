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
      <Body style={{ backgroundColor: '#ECECEC', fontFamily: 'Arial, sans-serif', margin: 0, padding: '20px 0' }}>
        <Container style={{ maxWidth: 580, margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: 4, overflow: 'hidden' }}>
          {/* Barre rouge CDC en haut */}
          <Section style={{ height: 4, backgroundColor: '#E30613', margin: 0 }} />

          <Section style={{ padding: '32px 32px 24px', borderBottom: '1px solid #D6D8D9' }}>
            <Text style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontWeight: 900, fontSize: 20, color: '#E30613', margin: 0, letterSpacing: '-0.02em' }}>
              cdc <span style={{color: '#1d1d1b'}}>habitat</span>
            </Text>
            <Text style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#828485', margin: '6px 0 0 0', fontWeight: 500 }}>
              Rencontre Nationale Patrimoine 2026
            </Text>
          </Section>

          <Section style={{ padding: '32px' }}>
            <Text style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#E30613', fontWeight: 700, margin: 0 }}>
              ● Invitation
            </Text>
            <Heading style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontWeight: 800, fontSize: 32, lineHeight: 1.1, color: '#1d1d1b', margin: '16px 0 20px 0', letterSpacing: '-0.02em' }}>
              {firstName ? `${firstName}, deux jours` : 'Deux jours'} pour bâtir{' '}
              <span style={{ color: '#E30613' }}>ensemble le patrimoine.</span>
            </Heading>
            <Text style={{ fontFamily: 'Arial, sans-serif', fontSize: 15, lineHeight: 1.6, color: '#4C4C4B', marginBottom: 16 }}>
              La Direction du Patrimoine Groupe a le plaisir de vous convier à la{' '}
              <strong>{eventTitle}</strong>, organisée les <strong>{eventDates}</strong> à{' '}
              <strong>{eventLocation}</strong>.
            </Text>
            <Text style={{ fontFamily: 'Arial, sans-serif', fontSize: 15, lineHeight: 1.6, color: '#4C4C4B', marginBottom: 32 }}>
              Au programme : ateliers collaboratifs, tables rondes stratégiques, visites du patrimoine
              lyonnais et temps de networking entre les 150 à 200 collaborateurs du Groupe.
            </Text>

            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={inviteUrl}
                style={{
                  backgroundColor: '#E30613',
                  color: '#FFFFFF',
                  padding: '16px 36px',
                  borderRadius: 4,
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-block',
                  letterSpacing: '0.02em',
                }}
              >
                Confirmer ma présence →
              </Button>
            </Section>

            <Text style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#828485', textAlign: 'center', marginTop: 16 }}>
              Clôture des inscriptions le <strong style={{ color: '#E30613' }}>{deadline}</strong>
            </Text>
          </Section>

          <Hr style={{ borderColor: '#D6D8D9', margin: '0 32px' }} />

          <Section style={{ padding: '24px 32px 32px' }}>
            <Text style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, lineHeight: 1.6, color: '#828485', margin: 0 }}>
              Une question ? Écrivez à{' '}
              <a href={`mailto:${contactEmail}`} style={{ color: '#E30613', fontWeight: 600 }}>{contactEmail}</a>
            </Text>
            <Text style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#828485', marginTop: 24 }}>
              CDC Habitat — GIE Expertise &amp; Support · Direction du Patrimoine Groupe
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
