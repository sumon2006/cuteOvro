import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// API route for High Thinking Gemini AI
app.post('/api/gemini/thinking', async (req, res) => {
  try {
    const { prompt, type, productInfo } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        success: true,
        result: generateFallbackThinking(type, prompt, productInfo),
        source: 'smart-heuristic-engine',
        note: 'GEMINI_API_KEY not configured. Generated via built-in dropshipping intelligence engine.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are a world-class Indian D2C dropshipping strategist, pricing optimizer, and viral copywriter.
You understand UPI prepaid conversion tricks, COD RTO (Return-to-Origin) risk mitigation, Meesho/Indiamart wholesale pricing, and WhatsApp customer recovery.
Think deeply through customer psychology, margin sustainability (COGS, shipping, RTO buffer, ad CAC), and direct conversion triggers.`;

    const fullPrompt = `${systemPrompt}\n\nTask:\n${prompt}\n\nProduct Information:\n${JSON.stringify(productInfo || {}, null, 2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: fullPrompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    return res.json({
      success: true,
      result: response.text,
      source: 'gemini-3.1-pro-preview (high-thinking)',
    });
  } catch (err: any) {
    console.error('Gemini error:', err);
    return res.json({
      success: true,
      result: generateFallbackThinking(req.body.type, req.body.prompt, req.body.productInfo),
      source: 'smart-heuristic-engine-fallback',
      warning: err.message
    });
  }
});

function generateFallbackThinking(type: string, prompt: string, info: any = {}) {
  const title = info?.title || 'Trending Product';
  const category = info?.category || 'Lifestyle';
  const price = Number(info?.price) || 899;
  const wholesaleCost = Math.round(price * 0.38);
  const shippingCost = 65;
  const targetCac = Math.round(price * 0.28);
  const netProfit = price - (wholesaleCost + shippingCost + targetCac);
  const netMargin = Math.round((netProfit / price) * 100);

  if (type === 'copy') {
    return `🔥 **Top-Selling Description for ${title} (${category})**

✨ **Why Customers Love It:**
• Premium handpicked craft & export-grade finish for long-lasting everyday durability.
• Lightweight, skin-friendly, and breathable fabric/build tailored for all-weather comfort.
• Trendsetter design guaranteed to turn heads at festive gatherings, offices, or casual outings.

📦 **Dropshipper Highlights:**
• 100% Quality Checked before packaging.
• Safe, tamper-proof bubble mailer dispatch within 24 hours.
• Fast 3-5 business days doorstep pan-India delivery with real-time tracking updates.

💡 **Prepaid Bonus:** Get direct instant verification and priority queue dispatch when you pay via UPI QR!`;
  }

  if (type === 'pricing') {
    return `📊 **Dropshipping Profitability & Margin Breakdown for ₹${price}**

1. **Estimated Sourcing Cost (COGS):** ~₹${wholesaleCost} (from Surat/Jaipur/Delhi wholesale clusters)
2. **Standard Logistics (0.5kg Air/Surface):** ₹${shippingCost}
3. **Target Facebook / Instagram Ad CAC:** ₹${targetCac}
4. **Estimated Net Profit per Order:** **₹${netProfit} (${netMargin}% Net Margin)**

🎯 **Strategic Recommendations:**
• **COD vs UPI Incentive:** Offer ₹50 flat discount or a free matching scrunchie/accessory to boost UPI prepaid orders and slash COD RTO losses.
• **Bundling:** Create a "Buy 2 Get 15% OFF" bundle to push AOV (Average Order Value) past ₹1,499.`;
  }

  return `💡 **Dropshipping Strategic Analysis for ${title}:**
- **Target Audience:** Tier-1 and Tier-2 young shoppers aged 18-35.
- **Conversion Tip:** Display genuine trust badges ("Easy 7-day exchanges", "Direct UPI Instant Confirmation", "Zero Delivery Charges").
- **WhatsApp Follow-up:** Send automated confirmation within 3 minutes of order placement to confirm COD addresses and reduce RTO.`;
}

// Development vs Production serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port} at http://0.0.0.0:${port}`);
});
