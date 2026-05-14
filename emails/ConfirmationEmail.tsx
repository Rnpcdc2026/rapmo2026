import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from '@react-email/components';
import * as React from 'react';

type Props = {
  firstName: string;
  reference: string;
  eventTitle: string;
  eventDates: string;
  eventLocation: string;
  visitTitle?: string | null;
  nightDates?: string[];
  contactEmail: string;
  appUrl: string;
};

export default function ConfirmationEmail({
  firstName,
  reference,
  eventTitle,
  eventDates,
  eventLocation,
  visitTitle,
  nightDates = [],
  contactEmail,
  appUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Votre inscription à {eventTitle} est confirmée — réf. {reference}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>● Rencontre Nationale Patrimoine</Text>
            <Text style={brandMeta}>Édition 2026</Text>
          </Section>

          <Section style={hero}>
            <Text style={eyebrow}>Inscription confirmée</Text>
            <Heading style={h1}>
              Bonjour {firstName}, à <em style={{ color: '#9a3412' }}>très bientôt</em> à Lyon.
            </Heading>
            <Text style={lede}>
              Votre inscription à <strong>{eventTitle}</strong> est bien enregistrée. Vous recevrez
              le programme détaillé et les informations pratiques début septembre.
            </Text>
          </Section>

          <Section style={recap}>
            <Text style={recapTitle}>RÉCAPITULATIF</Text>
            <Row label="Référence" value={reference} />
            <Row label="Dates" value={eventDates} />
            <Row label="Lieu" value={eventLocation} />
            <Row label="Visite" value={visitTitle || 'Aucune'} />
            <Row
              label="Nuitées"
              value={nightDates.length === 0 ? 'Aucune' : nightDates.join(' & ')}
            />
          </Section>

          <Hr style={hr} />

          <Section>
            <Text style={paragraph}>
              <strong>Besoin de modifier votre inscription ?</strong>
              <br />
              Écrivez-nous à <Link href={`mailto:${contactEmail}`} style={link}>{contactEmail}</Link> en
              précisant votre référence d'inscription.
            </Text>
            <Text style={paragraph}>
              <strong>Plus d'informations sur l'événement :</strong>
              <br />
              <Link href={appUrl} style={link}>{appUrl}</Link>
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              CDC Habitat — GIE Expertise &amp; Support · Direction du Patrimoine Groupe
            </Text>
            <Text style={footerText}>Référence dossier : DPG-SMO-2026-01</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', borderBottom: '1px solid #ede2cd' }}>
      <tr>
        <td style={{ padding: '12px 0', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(26,22,18,0.55)', width: 140 }}>
          {label}
        </td>
        <td style={{ padding: '12px 0', fontFamily: 'Georgia, serif', fontSize: 16, color: '#1a1612', textAlign: 'right' }}>
          {value}
        </td>
      </tr>
    </table>
  );
}

const body = { backgroundColor: '#fbf7f1', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', margin: 0, padding: 0 };
const container = { maxWidth: 580, margin: '0 auto', padding: '48px 32px', backgroundColor: '#fbf7f1' };
const header = { paddingBottom: 32, borderBottom: '1px solid #ede2cd', marginBottom: 40 };
const brand = { fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#1a1612', margin: 0 };
const brandMeta = { fontSize: 12, color: 'rgba(26,22,18,0.55)', margin: '4px 0 0 0' };
const hero = { marginBottom: 32 };
const eyebrow = { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#c2410c', fontWeight: 500, margin: 0 };
const h1 = { fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 36, lineHeight: 1.1, color: '#1a1612', margin: '20px 0 16px 0' };
const lede = { fontSize: 15, lineHeight: 1.6, color: 'rgba(26,22,18,0.7)', margin: 0 };
const recap = { backgroundColor: '#f4ede0', padding: 24, borderRadius: 4, marginTop: 24 };
const recapTitle = { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(26,22,18,0.55)', margin: '0 0 16px 0' };
const hr = { borderColor: '#ede2cd', margin: '32px 0' };
const paragraph = { fontSize: 14, lineHeight: 1.6, color: 'rgba(26,22,18,0.75)', marginBottom: 16 };
const link = { color: '#c2410c', textDecoration: 'underline' };
const footer = { marginTop: 24 };
const footerText = { fontSize: 12, color: 'rgba(26,22,18,0.5)', margin: '4px 0' };
