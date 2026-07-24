import type { WidgetServerProps } from 'payload'

import { getDonationStats, getReferrerStats } from '@/lib/donation-stats'
import { formatTomans } from '@/lib/format'
import { GENERAL_DONATION_TITLE } from '@/lib/payment-amounts'

const cardStyle: React.CSSProperties = {
  height: '100%',
  padding: '20px',
  borderRadius: '12px',
  background: 'var(--theme-elevation-50)',
  border: '1px solid var(--theme-elevation-100)',
}

const cardValueStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  margin: 0,
}

const cardLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--theme-elevation-500)',
  margin: '6px 0 0',
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={cardStyle}>
      <p style={cardValueStyle}>{value}</p>
      <p style={cardLabelStyle}>{label}</p>
    </div>
  )
}

export async function TotalRaisedWidget({ req }: WidgetServerProps) {
  const stats = await getDonationStats(req.payload)
  return <StatCard label="جمع کمک‌های موفق" value={formatTomans(stats.totalRaised)} />
}

export async function SuccessCountWidget({ req }: WidgetServerProps) {
  const stats = await getDonationStats(req.payload)
  return <StatCard label="پرداخت موفق" value={stats.successCount.toLocaleString('fa-IR')} />
}

export async function PendingCountWidget({ req }: WidgetServerProps) {
  const result = await req.payload.count({
    collection: 'donations',
    where: { status: { equals: 'pending' } },
  })
  return <StatCard label="در انتظار پرداخت" value={result.totalDocs.toLocaleString('fa-IR')} />
}

export async function OccasionsBreakdownWidget({ req }: WidgetServerProps) {
  const [stats, occasionsResult] = await Promise.all([
    getDonationStats(req.payload),
    req.payload.find({
      collection: 'occasions',
      limit: 100,
      depth: 0,
      select: { title: true },
    }),
  ])

  const occasionTitles = new Map<number, string>(
    occasionsResult.docs.map((occasion) => [occasion.id, occasion.title]),
  )

  const breakdown = Object.entries(stats.raisedByOccasion)
    .map(([occasionId, raised]) => ({
      title: occasionTitles.get(Number(occasionId)) || `مناسبت #${occasionId}`,
      raised,
    }))
    .sort((a, b) => b.raised - a.raised)

  if (stats.generalRaised > 0) {
    breakdown.push({ title: GENERAL_DONATION_TITLE, raised: stats.generalRaised })
  }

  const maxRaised = breakdown.reduce((max, item) => Math.max(max, item.raised), 0)

  return (
    <div style={cardStyle}>
      <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 14px' }}>
        تفکیک کمک‌ها به‌ازای مناسبت
      </p>

      {breakdown.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500)', margin: 0 }}>
          هنوز پرداخت موفقی ثبت نشده است.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {breakdown.map((item) => {
            const percent = maxRaised > 0 ? Math.round((item.raised / maxRaised) * 100) : 0

            return (
              <div key={item.title}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    fontSize: '13px',
                    marginBottom: '4px',
                  }}
                >
                  <span>{item.title}</span>
                  <span style={{ fontWeight: 600 }}>{formatTomans(item.raised)}</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '999px',
                    background: 'var(--theme-elevation-100)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: 'var(--theme-success-500)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export async function ReferrersBreakdownWidget({ req }: WidgetServerProps) {
  const referrers = await getReferrerStats(req.payload)
  const maxRaised = referrers.reduce((max, item) => Math.max(max, item.amount), 0)

  return (
    <div style={cardStyle}>
      <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px' }}>
        معرف‌های حمایت عمومی — این ماه
      </p>
      <p style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', margin: '0 0 14px' }}>
        جمع کمک‌های موفق که هر عضو هیات امنا معرف آن‌ها بوده است
      </p>

      {referrers.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500)', margin: 0 }}>
          در این ماه هنوز معرفی ثبت نشده است.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {referrers.map((item) => {
            const percent = maxRaised > 0 ? Math.round((item.amount / maxRaised) * 100) : 0

            return (
              <div key={item.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    fontSize: '13px',
                    marginBottom: '4px',
                  }}
                >
                  <span>
                    {item.name}
                    <span style={{ color: 'var(--theme-elevation-500)', marginRight: '6px' }}>
                      ({item.count.toLocaleString('fa-IR')} کمک)
                    </span>
                  </span>
                  <span style={{ fontWeight: 600 }}>{formatTomans(item.amount)}</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '999px',
                    background: 'var(--theme-elevation-100)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: 'var(--theme-success-500)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
