import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

import type { DonationReceiptData } from '@/lib/donation-receipt-data'

const palette = {
  primary: '#0F766E',
  primaryDark: '#115E59',
  primarySoft: '#ECFDF5',
  text: '#111827',
  muted: '#6B7280',
  line: '#E5E7EB',
  white: '#FFFFFF',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Abar',
    backgroundColor: '#F8FAFC',
    padding: 0,
  },
  topBar: {
    backgroundColor: palette.primary,
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: palette.white,
    textAlign: 'center',
  },
  topDate: {
    marginTop: 4,
    fontSize: 8.5,
    color: '#D1FAE5',
    textAlign: 'center',
  },
  body: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 18,
  },
  logoShell: {
    alignSelf: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: palette.white,
    borderWidth: 3,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  logo: {
    width: 52,
    height: 52,
    objectFit: 'contain',
  },
  logoFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFallbackText: {
    fontSize: 22,
    fontWeight: 700,
    color: palette.primary,
  },
  siteName: {
    fontSize: 11.5,
    fontWeight: 700,
    color: palette.text,
    textAlign: 'center',
  },
  donorName: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: 600,
    color: '#374151',
    textAlign: 'center',
  },
  donorPhone: {
    marginTop: 2,
    fontSize: 8.5,
    color: palette.muted,
    textAlign: 'center',
  },
  amountCard: {
    marginTop: 14,
    marginBottom: 12,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  amount: {
    fontSize: 24,
    fontWeight: 700,
    color: palette.primaryDark,
    textAlign: 'center',
  },
  amountLabel: {
    marginTop: 4,
    fontSize: 9,
    color: palette.muted,
    textAlign: 'center',
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: palette.primarySoft,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 700,
    color: palette.primary,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 14,
    overflow: 'hidden',
  },
  detailsHeader: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  detailsHeaderText: {
    fontSize: 9,
    fontWeight: 700,
    color: '#334155',
    textAlign: 'right',
  },
  detailRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 8.5,
    color: palette.muted,
    flexShrink: 0,
  },
  detailValue: {
    fontSize: 8.5,
    fontWeight: 600,
    color: palette.text,
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: palette.line,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7.5,
    color: '#94A3B8',
    textAlign: 'center',
  },
})

type DonationReceiptDocumentProps = {
  data: DonationReceiptData
}

export function DonationReceiptDocument({ data }: DonationReceiptDocumentProps) {
  const logoInitial = data.siteName.trim().charAt(0) || 'ه'

  const details = [
    { label: 'موضوع کمک', value: data.occasionTitle },
    { label: 'کد پیگیری', value: data.trackingCode },
    { label: 'کد مرجع', value: data.refId },
    { label: 'روش پرداخت', value: data.paymentMethod },
  ]

  return (
    <Document>
      <Page size="A5" style={styles.page} wrap={false}>
        <View style={styles.topBar}>
          <Text style={styles.topTitle}>رسید پرداخت</Text>
          <Text style={styles.topDate}>{data.createdAtLabel}</Text>
        </View>

        <View style={styles.body}>
          {data.logoSrc ? (
            <View style={styles.logoShell}>
              <Image src={data.logoSrc} style={styles.logo} />
            </View>
          ) : (
            <View style={[styles.logoShell, styles.logoFallback]}>
              <Text style={styles.logoFallbackText}>{logoInitial}</Text>
            </View>
          )}

          <Text style={styles.siteName}>{data.siteName}</Text>
          <Text style={styles.donorName}>{data.donorName}</Text>
          <Text style={styles.donorPhone}>{data.donorPhone}</Text>

          <View style={styles.amountCard}>
            <Text style={styles.amount}>{data.amountLabel}</Text>
            <Text style={styles.amountLabel}>مبلغ پرداخت</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{data.statusLabel}</Text>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsHeaderText}>جزئیات تراکنش</Text>
            </View>
            {details.map((detail, index) => (
              <View
                key={detail.label}
                style={[
                  styles.detailRow,
                  ...(index === details.length - 1 ? [styles.detailRowLast] : []),
                ]}
              >
                <Text style={styles.detailLabel}>{detail.label}</Text>
                <Text style={styles.detailValue}>{detail.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{data.siteName}</Text>
            <Text style={styles.footerText}>{data.siteUrl}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
