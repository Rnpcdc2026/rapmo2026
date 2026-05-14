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
      <Body style={{ backgroundColor: '#fbf7f1', fontFamily: '-apple-system, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 580, margin: '0 auto', padding: '48px 32px' }}>
          <Section style={{ paddingBottom: 32, borderBottom: '1px solid #ede2cd', marginBottom: 32 }}>
            <Text style={{ fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, margin: 0, color: '#1a1612' }}>
              ● Rencontre Nationale Patrimoine
            </Text>
          </Section>

          <Section>
            <Text style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#c2410c', fontWeight: 500, margin: 0 }}>
              Relance · Clôture imminente
            </Text>
            <Heading style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 32, lineHeight: 1.1, color: '#1a1612', margin: '20px 0' }}>
              {firstName ? `${firstName}, ne` : 'Ne'} <em style={{ color: '#9a3412' }}>tardez plus</em> à vous inscrire.
            </Heading>
            <Text style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(26,22,18,0.75)' }}>
              Nous n'avons pas encore reçu votre confirmation de présence pour{' '}
              <strong>{eventTitle}</strong>, les <strong>{eventDates}</strong>.
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(26,22,18,0.75)', marginBottom: 32 }}>
              Les inscriptions ferment le <strong>{deadline}</strong>. Quelques minutes
              suffisent pour réserver votre place, votre visite et votre hébergement.
            </Text>

            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={inviteUrl}
                style={{
                  backgroundColor: '#c2410c',
                  color: '#fbf7f1',
                  padding: '16px 36px',
                  borderRadius: 50,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Je m'inscris maintenant →
              </Button>
            </Section>

            <Text style={{ fontSize: 13, color: 'rgba(26,22,18,0.55)', marginTop: 32 }}>
              Une question ou un empêchement ? Écrivez-nous à{' '}
              <a href={`mailto:${contactEmail}`} style={{ color: '#c2410c' }}>{contactEmail}</a>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
