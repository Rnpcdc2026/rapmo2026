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
} from '@react-email/components';
import * as React from 'react';

type Props = {
  firstName?: string | null;
  eventTitle: string;
  eventDates: string;
  deadline: string;
  inviteUrl: string;
  contactEmail: string;
};

export default function ReminderEmail({
  firstName,
  eventTitle,
  eventDates,
  deadline,
  inviteUrl,
  contactEmail,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>⏳ Plus que quelques jours pour confirmer votre présence à la {eventTitle}</Preview>
      <Body style={{ backgroundColor: '#ECECEC', fontFamily: 'Arial, sans-serif', margin: 0, padding: '20px 0' }}>
        <Container style={{ maxWidth: 580, margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: 4, overflow: 'hidden' }}>
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
              ● Relance · Clôture imminente
            </Text>
            <Heading style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontWeight: 800, fontSize: 28, lineHeight: 1.1, color: '#1d1d1b', margin: '16px 0', letterSpacing: '-0.02em' }}>
              {firstName ? `${firstName}, ne` : 'Ne'} <span style={{ color: '#E30613' }}>tardez plus</span> à vous inscrire.
            </Heading>
            <Text style={{ fontFamily: 'Arial, sans-serif', fontSize: 15, lineHeight: 1.65, color: '#4C4C4B' }}>
              Nous n'avons pas encore reçu votre confirmation de présence pour{' '}
              <strong>{eventTitle}</strong>, les <strong>{eventDates}</strong>.
            </Text>
            <Text style={{ fontFamily: 'Arial, sans-serif', fontSize: 15, lineHeight: 1.65, color: '#4C4C4B', marginBottom: 32 }}>
              Les inscriptions ferment le <strong>{deadline}</strong>. Quelques minutes
              suffisent pour réserver votre place, votre visite et votre hébergement.
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
                Je m'inscris maintenant →
              </Button>
            </Section>

            <Text style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#828485', marginTop: 32 }}>
              Une question ou un empêchement ? Écrivez-nous à{' '}
              <a href={`mailto:${contactEmail}`} style={{ color: '#E30613', fontWeight: 600 }}>{contactEmail}</a>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
