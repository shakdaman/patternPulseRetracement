

# **The Ultimate FVG Indicator: A Technical Report on Design, Quantification, and Pine Script v6 Implementation**

## **Section 1: Introduction to Fair Value Gaps as Market Inefficiencies**

The concept of the Fair Value Gap (FVG) has become a cornerstone of modern price action analysis, particularly within methodologies that focus on institutional order flow and market structure. An FVG represents a momentary inefficiency or imbalance in the market, a brief period where the normal, two-sided price delivery process is disrupted by aggressive, one-sided momentum.1 These formations are not random chart anomalies; they are quantifiable, recurring patterns that offer profound insights into market psychology and the footprints of large market participants. Understanding their anatomy, the reasons for their formation, and their functional role is the first step toward developing a sophisticated analytical tool capable of exploiting these inefficiencies. This section establishes the theoretical framework for FVGs, defining their structure and exploring the underlying market dynamics that imbue them with predictive value.

### **1.1. Defining the FVG: The Three-Candle Anatomy of Imbalance**

At its core, a Fair Value Gap is a specific three-candle formation that highlights a gap in price delivery.3 Unlike traditional overnight or session gaps, which occur between the close of one candle and the open of the next, an FVG is an imbalance that occurs *within* a contiguous price sequence.5 The structure is defined by the relationship between the wicks of the first and third candles in the pattern, with the middle candle representing a strong, impulsive move that creates the inefficiency.

* **Bullish FVG Formation:** A bullish FVG is identified when the market moves upward with such velocity that a gap is left between the high of the first candle and the low of the third candle. The second candle in this formation is typically a large, strong bullish candle that demonstrates the force of the upward displacement.2 The space between high and low of the current bar constitutes the FVG zone. This zone represents an area where price was offered on the buy-side but not efficiently on the sell-side, creating an imbalance that the market may later seek to rebalance.2  
* **Bearish FVG Formation:** Conversely, a bearish FVG is formed during a rapid downward move. The inefficiency is the space between the low of the first candle and the high of thethird candle. The middle candle is a strong bearish candle that drives the price down aggressively.3 This zone, defined by the space between low and high of the current bar, indicates an area where price was offered efficiently on the sell-side but not the buy-side.

The fundamental premise of FVG trading is that the market has a tendency to revisit these inefficiently priced areas to "fill the gap" before potentially continuing in its original direction.2 This rebalancing action provides high-probability zones for trade entries.

The foundational logic for detecting these patterns in Pine Script is straightforward. A bullish FVG is confirmed on the close of the third candle if the condition low \> high is met. A bearish FVG is confirmed if high \< low is met.6 This simple binary condition forms the basis upon which more complex filters for strength and validity can be built.

### **1.2. The Market Psychology Behind FVGs: Institutional Footprints and Liquidity Voids**

The formation of an FVG is rarely accidental. It is typically the result of significant market-moving events that trigger a surge in one-sided order flow. These catalysts can include the release of key economic data like interest rate decisions or inflation reports, major geopolitical events, or, most commonly, the execution of large institutional orders.2 When a large institution like a hedge fund or bank needs to execute a massive buy or sell program, it can absorb all available liquidity at successive price levels so quickly that it creates a "liquidity void"—an area with very little two-sided trade. This rapid price displacement is what manifests on the chart as an FVG.3

Therefore, FVGs can be interpreted as "institutional footprints".9 They mark the price levels where smart money was active, leaving behind a trail of unfilled orders and imbalanced price action. The market's tendency to return to these zones is driven by a mechanical need to rebalance liquidity. Large participants may need to mitigate their initial positions, or other algorithms are programmed to seek out these inefficient levels to execute trades.4

This institutional context is what gives FVGs their predictive power. The very existence of an FVG is a direct and unambiguous signal of strong, directional momentum. A market that is balanced and efficient does not produce FVGs. The presence of these gaps indicates that one side of the market—either buyers or sellers—has completely overwhelmed the other with such force that a fair, two-sided auction could not be maintained. This overwhelming force is the definition of powerful momentum. Consequently, an FVG serves a dual analytical purpose: it not only identifies a potential future turning point but also validates the strength and conviction of the price leg that created it. This understanding allows the FVG to be used as a confirmation tool for the health of a trend or the legitimacy of a breakout, elevating its utility beyond that of a simple entry pattern.

## **Section 2: A Multi-Factor Model for FVG Strength and Validity**

Simply detecting the presence of a Fair Value Gap is only the first step. Not all FVGs are created equal; some represent profound market imbalances that are highly likely to influence future price, while others are minor fluctuations that are quickly ignored. To build an "ultimate" indicator, it is essential to move beyond binary detection and implement a quantitative framework for assessing the strength and validity of each FVG. This section details a multi-factor model designed to score each FVG based on its internal structure, its magnitude relative to market volatility, and the volume participation during its formation. This composite score provides a nuanced, data-driven measure of an FVG's potential significance.

### **2.1. Primary Metric: The "Consistency Theory"**

The "Consistency Theory" is a principle derived from institutional trading concepts that evaluates the purity of the momentum behind an FVG's formation.10 It posits that an FVG created by three directionally aligned candles is significantly stronger than one formed by candles of mixed direction.

* **Definition:** A "one-sided" or "consistent" FVG is one where all three candles in the formation are of the same type (e.g., three consecutive bullish candles for a bullish FVG). This demonstrates pure, uninterrupted displacement and a high probability that the originating trend will continue.10 In contrast, an FVG formed with "two-sided" or inconsistent candles (e.g., a bearish candle, a strong bullish candle, then another bearish candle) indicates indecision and a lack of clear displacement, making the gap less reliable.10  
* **Quantification Model:** This qualitative theory can be translated into a simple yet effective quantitative score. A numerical value is assigned based on the directional alignment of the three candles involved in the FVG formation.  
  * **For a Bullish FVG:**  
    * Candle 1 (2 bars ago): \+1 if bullish (close \> open), 0 otherwise.  
    * Candle 2 (1 bar ago): \+1 (always bullish by definition).  
    * Candle 3 (current bar): \+1 if bullish (close \> open), 0 otherwise.  
    * *Total Score Range: 1 to 3\.*  
  * **For a Bearish FVG:**  
    * Candle 1 (2 bars ago): \+1 if bearish (close \< open), 0 otherwise.  
    * Candle 2 (1 bar ago): \+1 (always bearish by definition).  
    * Candle 3 (current bar): \+1 if bearish (close \< open), 0 otherwise.  
    * *Total Score Range: 1 to 3\.*

A score of 3 represents a "perfectly consistent" FVG, the highest quality according to this metric. A score of 1 is the minimum possible, as the middle candle must be directional to form the gap.

### **2.2. Secondary Metric: Magnitude Analysis (Size vs. Volatility)**

The absolute size of an FVG in points or pips is meaningless without context. A 10-point FVG on an index might be enormous during a quiet session but insignificant after a major news release. To properly assess an FVG's magnitude, its size must be normalized against the prevailing market volatility. The Average True Range (ATR) is the industry standard for measuring this volatility.

* **Implementation:** The height of the FVG (the distance between its high and low boundaries) is divided by the value of the ATR over a standard lookback period, such as 14 bars. This calculation yields a ratio that expresses the FVG's size as a multiple of the average candle range.  
* **Formula:** The magnitude score is calculated as: $Strength\_{Magnitude} \= \\frac{(FVG\_{High} \- FVG\_{Low})}{ta.atr(14)}$.  
* **Interpretation:** An FVG with a magnitude score greater than 1.0 is larger than the average true range of a single candle, indicating a statistically significant displacement. A score below 0.5 might suggest a minor inefficiency that is less likely to be respected. This approach is inspired by advanced indicators that use ATR multipliers to filter for significant price events and avoid market noise.11

### **2.3. Tertiary Metric: Volume Confirmation**

Volume is a critical component for validating price action. A significant price move accompanied by high volume suggests strong participation and conviction, often from institutional players.12 Conversely, a move on low volume may indicate a lack of commitment, making the resulting pattern less reliable.

* **Implementation:** This metric analyzes the volume of the middle (displacement) candle of the FVG formation. This volume is then compared to a short-term simple moving average (SMA) of volume, typically over 20 periods, to determine if there was a relative surge in activity.  
* **Formula:** The volume score is calculated as a ratio: $Strength\_{Volume} \= \\frac{volume}{ta.sma(volume, 20)}$.  
* **Interpretation:** A value significantly greater than 1.0 (e.g., \> 1.5) indicates a volume spike during the FVG's creation. This adds a layer of confirmation, suggesting that the imbalance was created by a genuine and powerful influx of orders, not just a momentary lack of liquidity. This aligns with the logic of sophisticated FVG tools that integrate volumetric analysis to gauge the importance of an imbalance.13

### **2.4. Developing a Composite Strength Score**

To provide a single, actionable measure of an FVG's validity, the three individual metrics—Consistency, Magnitude, and Volume—are combined into a composite score. A weighted average is the most flexible approach, as it allows the end-user to tailor the model to their specific strategy or the asset being traded.

* **Methodology:** The final score is calculated by assigning weights to each of the three components. For example, a trader who prioritizes the purity of the price action might assign a higher weight to the Consistency score, while a volume-focused trader might emphasize the Volume score.  
* Example Formula: $CompositeScore \= (w\_{c} \\cdot Score\_{Consistency}) \+ (w\_{m} \\cdot Score\_{Magnitude}) \+ (w\_{v} \\cdot Score\_{Volume})$  
  Where $w\_{c}$, $w\_{m}$, and $w\_{v}$ are the user-defined weights for Consistency, Magnitude, and Volume, respectively. The resulting scores are then normalized to a simple scale, such as 0 to 100, for easy interpretation.

This composite score is more than just a descriptive label; it serves as a powerful predictive filter. A structurally weak FVG—one formed with inconsistent candles, low relative magnitude, and anemic volume—will naturally have a low composite score. Such weak imbalances are inherently more susceptible to being violated by subsequent price action. This creates a direct relationship between the score and the probability of the FVG failing and becoming an Inverted FVG (iFVG). Therefore, the indicator can leverage this score to anticipate which FVGs are likely to produce reversal signals (high-scoring FVGs) and which are candidates for continuation signals upon failure (low-scoring FVGs), thereby proactively filtering for higher-probability trade setups.

The table below provides a clear summary of this multi-factor scoring model.

| Factor | Description | Calculation Method | Default Weight | Contribution to Score |
| :---- | :---- | :---- | :---- | :---- |
| **Consistency Theory** | Measures the directional alignment of the three candles forming the FVG. A score of 3 indicates perfect alignment. | Sum of directionally consistent candles (Score: 1-3). | 40% | Reflects the purity and conviction of the price displacement. |
| **Magnitude (vs. ATR)** | Normalizes the FVG's size against the market's recent volatility (14-period ATR). | $Ratio \= \\frac{(FVG\_{High} \- FVG\_{Low})}{ta.atr(14)}$. | 30% | Quantifies the statistical significance of the imbalance. |
| **Volume Confirmation** | Compares the volume of the middle (displacement) candle to the recent average volume (20-period SMA). | $Ratio \= \\frac{volume}{ta.sma(volume, 20)}$. | 30% | Validates the institutional participation behind the move. |

## **Section 3: The Polarity Shift: Inversion FVGs (iFVGs) as Continuation Catalysts**

While standard Fair Value Gaps are primarily used to anticipate retracements and reversals, a more advanced application involves analyzing what happens when they fail. The concept of an Inversion FVG (iFVG) describes the transformation that occurs when price decisively breaches a standard FVG, causing its polarity to flip and turning it into a powerful continuation signal.11 This section explores the mechanics of this transformation, the underlying market psychology, and how iFVGs function as dynamic support and resistance zones.

### **3.1. From Mitigation to Inversion: The Mechanics of a Failed FVG**

It is crucial to distinguish between simple *mitigation* and a full *inversion*. Mitigation occurs when price merely trades back into the FVG zone to rebalance the inefficiency, often respecting its boundaries before reversing.11 Inversion, however, is a more definitive and powerful event. It occurs when price not only enters the FVG but closes decisively *through* it, completely violating the imbalance and invalidating its original function.15

This act of inversion triggers a classic technical analysis principle: the flipping of support and resistance. When an FVG is inverted, its role in the market structure is reversed 15:

* **Bullish FVG Inversion:** A bullish FVG, which initially acted as a potential support zone, is breached when the price closes below its lower boundary. This invalidated support zone now transforms into a new potential resistance area.11  
* **Bearish FVG Inversion:** A bearish FVG, which was a potential resistance zone, is inverted when the price closes above its upper boundary. This broken resistance then becomes a new potential support level.11

The Pine Script logic for detecting an inversion is based on tracking the state of each FVG. An FVG is considered "active" upon formation. The inversion condition is triggered by the closing price of a candle. For a bullish FVG with boundaries fvg.max and fvg.min, the inversion condition is close \< fvg.min. For a bearish FVG, the condition is close \> fvg.max.

### **3.2. iFVGs as Dynamic Support and Resistance Zones**

The market psychology behind an iFVG is rooted in momentum and order flow. The market's ability to completely absorb the imbalance of a prior FVG and push through it demonstrates a significant and powerful shift in sentiment.14 This action signals that the directional force that caused the breach is dominant and likely to continue.17 The original FVG represented a point of strong opposition; by breaking through it, the market signals that this opposition has been overcome.

Consequently, traders use the newly formed iFVG zone as a high-probability area to enter continuation trades on a subsequent retest.17 The logic is as follows:

* After a **bullish FVG is inverted** (broken to the downside), it becomes a bearish iFVG (resistance). Traders will wait for the price to pull back up to this zone and look for opportunities to enter short positions, anticipating that the level will now hold as resistance.17  
* After a **bearish FVG is inverted** (broken to the upside), it becomes a bullish iFVG (support). Traders will wait for the price to retrace back down to this zone and look for long entries, expecting the level to now act as support.16

This highlights a critical two-phase process for an iFVG-based signal. The first phase is the *formation* of the iFVG, which is the candle close that violates the original FVG. This event confirms the shift in market control. The second phase is the *activation* of the trade signal, which occurs only when the price later *returns to and retests* the iFVG zone. An effective indicator must not generate a signal immediately upon the break, as this would be chasing momentum. Instead, it should flag the zone as "inverted" and then patiently wait for a pullback to the level. This two-step logic provides a more strategic entry at a more favorable price, aligning with professional trading methodologies that prioritize entries on retracements rather than breakouts.

## **Section 4: A Dual-Framework for Signal Generation**

Building upon the established concepts of FVG strength and iFVG polarity shifts, this section outlines the architecture for a dual-framework signal generation engine. This engine is designed to produce two distinct categories of trade signals as per the user query: high-probability **reversal signals** when strong FVGs are respected, and high-momentum **continuation signals** when weak FVGs are inverted and retested. This dual approach allows the indicator to adapt to different market conditions, capturing both mean-reversion and trend-following opportunities.

### **4.1. Framework A: Reversal Signals at Respected FVGs**

This framework focuses on the classic interpretation of an FVG as a zone where price is likely to reverse. The logic is designed to identify scenarios where a strong imbalance holds as support or resistance and is confirmed by a classic candlestick reversal pattern.

* **Condition 1: FVG is "Respected."** The primary condition is that price must interact with the FVG without invalidating it. The script must detect that the high or low of a candle has entered the FVG zone, but the close of that candle (or subsequent candles) has failed to breach the far boundary of the FVG. This confirms that the imbalance is acting as a significant barrier to price.  
* **Condition 2: Candlestick Confirmation Engine.** To filter out noise and increase the probability of a successful reversal, a signal is only generated if a specific, high-probability candlestick reversal pattern forms *while the price is interacting with the FVG zone*. A robust engine will be implemented to detect a selection of potent patterns:  
  * **Bullish Reversal Patterns for Buy Signals (within a Bullish FVG):**  
    * **Bullish Engulfing:** A powerful two-candle pattern where a large bullish candle completely engulfs the body of the preceding bearish candle, signaling a strong shift in momentum.19  
    * **Hammer:** A single-candle pattern with a long lower wick and a small body at the top, indicating a strong rejection of lower prices.20  
    * **Piercing Line:** A two-candle pattern where a bullish candle opens below the prior low but closes more than halfway into the body of the preceding bearish candle.22  
    * **Morning Star:** A three-candle pattern consisting of a large bearish candle, a small-bodied "star" candle, and a large bullish candle, signaling a bottoming formation.23  
  * **Bearish Reversal Patterns for Sell Signals (within a Bearish FVG):**  
    * **Bearish Engulfing:** The opposite of its bullish counterpart, where a large bearish candle engulfs the prior bullish candle.19  
    * **Shooting Star:** A single-candle pattern with a long upper wick and a small body at the bottom, indicating a rejection of higher prices.25  
    * **Dark Cloud Cover:** A two-candle pattern where a bearish candle opens above the prior high but closes more than halfway into the body of the preceding bullish candle.27  
    * **Evening Star:** The bearish counterpart to the Morning Star, signaling a market top.29  
* **Signal Trigger & Filtering:** A "Buy" signal is generated when a valid bullish reversal pattern is detected within a respected bullish FVG. A "Sell" signal is triggered upon the detection of a bearish reversal pattern within a respected bearish FVG. Crucially, this framework will incorporate the Composite Strength Score from Section 2\. A user-configurable input will allow traders to only consider reversal signals that form within FVGs scoring above a certain threshold (e.g., 60/100), ensuring that trades are only taken at zones of proven, quantifiable significance.

### **4.2. Framework B: Continuation Signals from Inverted FVGs**

This framework operates on the principle that a broken FVG signals a continuation of the trend that caused the break. The logic is designed to capture high-momentum trades by entering on a pullback to the newly established support or resistance level.

* **Condition 1: FVG is Inverted.** The script must first confirm that an FVG's state has changed to "inverted," as defined by a candle closing completely through its original boundaries.  
* **Condition 2: Price Retests the iFVG Zone.** Following the inversion, the script enters a "watch" mode, waiting for price to retrace and re-enter the coordinates of the now-inverted FVG zone. This aligns with the strategy of waiting for a pullback to a broken level before entering.17  
* **Signal Trigger:**  
  * A **"Buy" (Continuation) signal** is generated when price pulls back to test a *former bearish FVG that has been inverted to the upside*. The zone is now expected to act as support. The signal is confirmed when a bullish candle closes after the retest.  
  * A **"Sell" (Continuation) signal** is generated when price pulls back to test a *former bullish FVG that has been inverted to the downside*. The zone is now expected to act as resistance. The signal is confirmed by a bearish candle closing after the retest.  
* **Strength-Based Filtering:** This framework utilizes the Composite Strength Score in a counterintuitive but logical way. Since weak FVGs are more likely to fail, the indicator will include a setting to only look for continuation signals on FVGs that had an *initial* strength score *below* a user-defined threshold (e.g., 40/100). This proactively identifies the most probable candidates for inversion.

By implementing this dual framework, the indicator can provide a more complete picture of market dynamics. Furthermore, a hierarchy of signal confidence can be established. Signals can be visually differentiated based on their components. For instance, a reversal confirmed by a powerful, multi-candle pattern like a Bullish Engulfing within a high-scoring FVG could be labeled "High-Probability Reversal" and plotted with a larger arrow. In contrast, a reversal confirmed by a single-candle Hammer in a medium-strength FVG could be a "Standard Reversal." This gives the trader an immediate, visual cue about the quality of the setup, allowing for more nuanced decision-making and risk allocation.

The table below summarizes the logic for each of the four primary signal types generated by the indicator.

| Signal Type | Required FVG State | Confirmation Trigger | Target Logic |
| :---- | :---- | :---- | :---- |
| **Bullish Reversal** | Bullish FVG is "Respected" (price enters but does not close below). | Formation of a valid bullish candlestick reversal pattern (e.g., Bullish Engulfing, Hammer) inside the FVG. | Plot the most recent significant swing high. |
| **Bearish Reversal** | Bearish FVG is "Respected" (price enters but does not close above). | Formation of a valid bearish candlestick reversal pattern (e.g., Bearish Engulfing, Shooting Star) inside the FVG. | Plot the most recent significant swing low. |
| **Bullish Continuation** | Bearish FVG has been "Inverted" (price closed above). | Price pulls back to retest the iFVG zone (now support) and a bullish candle closes. | Plot the most recent significant swing high. |
| **Bearish Continuation** | Bullish FVG has been "Inverted" (price closed below). | Price pulls back to retest the iFVG zone (now resistance) and a bearish candle closes. | Plot the most recent significant swing low. |

## **Section 5: Dynamic Targeting via Market Structure Analysis**

A trade signal is incomplete without a logical price target. A well-defined target is essential for calculating risk-to-reward ratios, managing trades, and formulating a coherent exit strategy. This section details the methodology for automatically identifying and plotting the most recent, structurally significant swing high or low as a price target for each generated signal. This transforms the indicator from a simple signal generator into a more comprehensive trade analysis tool.

### **5.1. Identifying Significant Swing Highs and Lows**

The foundation of market structure analysis lies in identifying swing points—the peaks and troughs that define the flow of price. The indicator will use Pine Script's built-in pivot detection functions as a starting point for this process.

* **Core Logic:** The functions ta.pivothigh(source, leftBars, rightBars) and ta.pivotlow(source, leftBars, rightBars) are highly effective for identifying basic swing points.31 A pivot high is a candle whose high is greater than the highs of a specified number of candles to its left and right. A pivot low is a candle whose low is lower than the lows of the surrounding candles.  
* **User Inputs:** The lookback periods, leftBars and rightBars, will be exposed as user-configurable inputs. This allows traders to adjust the sensitivity of the swing detection mechanism to align with their preferred trading timeframe. Shorter lookbacks (e.g., 3\) will identify more minor, short-term swings, while longer lookbacks (e.g., 10\) will filter for more significant, major turning points.32

### **5.2. Filtering Logic: Differentiating Major Pivots from Market Noise**

Using the standard pivot functions alone can often generate an excessive number of swing points, many of which are simply minor fluctuations within a larger price leg. To identify truly significant targets, a filtering layer must be applied to isolate the major pivots that define the primary market structure.

A more sophisticated approach involves tracking the alternating sequence of peaks and troughs, ensuring that the indicator is mapping out a logical progression of higher highs/higher lows or lower highs/lower lows.34 The filtering logic will adhere to the following rules:

1. **Alternating Sequence:** After a significant swing high is confirmed, the script will only look for the next significant swing low, ignoring any minor intervening highs. Conversely, after a swing low is confirmed, it will only search for the next swing high.  
2. **Highest High / Lowest Low:** If multiple pivot highs form before a valid swing low is established, only the absolute highest of those pivots is considered the significant swing high. Similarly, only the absolute lowest pivot low is recorded between two swing highs.34

This advanced filtering ensures that the targets plotted by the indicator represent meaningful structural points—the kind of levels that act as magnets for price and are often targeted by institutional algorithms for liquidity.

### **5.3. Automated Plotting of Targets for Active Signals**

Once a trade signal is generated by either the Reversal or Continuation framework, the targeting engine activates to identify and plot the most logical objective.

* **Targeting Rule for Buy Signals:** When any "Buy" signal is triggered, the indicator will access its stored array of significant swing points and identify the price of the most recent *significant swing high*. It will then plot a horizontal line at this price level, extending it forward in time and labeling it as "Buy Target."  
* **Targeting Rule for Sell Signals:** When any "Sell" signal is triggered, the indicator will retrieve the price of the most recent *significant swing low* and plot it as the "Sell Target."  
* **Line Management:** To maintain chart clarity, the plotted target line will be managed dynamically. It will be automatically removed from the chart once the price touches or crosses it (target achieved) or if a new, opposing signal is generated, which would invalidate the previous trade setup.

This automated targeting mechanism provides a significant advantage by removing subjectivity and discretion from the process of selecting a take-profit level. More importantly, it enables a further layer of quantitative analysis. With a clearly defined entry point (from the signal), a logical stop-loss level (e.g., just beyond the opposite side of the FVG) 8, and an automatically plotted target, the indicator can calculate the potential risk-to-reward (R/R) ratio for every single setup in real-time. This calculated R/R ratio can be displayed on the signal's label. A user input can then be added to filter out any signals that do not meet a minimum R/R threshold (e.g., 2:1 or 3:1), automatically eliminating low-quality trade setups and enforcing disciplined trade selection.

## **Section 6: Architectural Blueprint and Pine Script v6 Implementation**

This section provides the architectural design and key implementation details for the FVG indicator using Pine Script v6. The focus is on creating a modular, efficient, and readable codebase that can handle the complex state management required by the indicator's features. The use of modern Pine Script v6 features, such as custom data types and improved logical operators, is central to this design.

### **6.1. Indicator Architecture and Data Structures**

A robust architecture is crucial for managing the various components of the indicator. The design will be centered around custom data types (UDTs) to encapsulate related information and arrays to manage the lifecycle of detected objects.

* **User-Defined Types (UDTs):**  
  * type fvg: This custom type will be the core data structure for storing all information related to a single Fair Value Gap. It will contain fields for its price boundaries, direction, state, and analytical metrics.  
    Pine Script  
    type fvg  
        float top  
        float bottom  
        bool isBullish  
        int startTime  
        int strengthScore  
        string state // "active", "mitigated", "inverted"

  * type pivot: This UDT will store information about significant swing points.  
    Pine Script  
    type pivot  
        float price  
        int time  
        bool isHigh

* **State Management with Arrays:**  
  * var fvg fvgs\_active: An array to hold all currently active (unmitigated and non-inverted) FVG objects.  
  * var pivot pivots\_major: An array to store the sequence of filtered, significant swing highs and lows.  
* **Indicator Input Parameters:** The following table outlines the key user-configurable inputs that will allow for flexible control over the indicator's behavior.

| Parameter Name | UI Label | Data Type | Description | Default Value |
| :---- | :---- | :---- | :---- | :---- |
| fvgAtrThreshold | FVG Min Size (x ATR) | float | Minimum size of an FVG relative to the 14-period ATR to be considered valid. | 0.7 |
| consistencyWeight | Strength Weight: Consistency | int | Weighting (0-100) for the Consistency Theory score in the composite calculation. | 40 |
| magnitudeWeight | Strength Weight: Magnitude | int | Weighting (0-100) for the Magnitude vs. ATR score. | 30 |
| volumeWeight | Strength Weight: Volume | int | Weighting (0-100) for the Volume Confirmation score. | 30 |
| reversalMinScore | Reversal Signal Min Strength | int | Minimum composite score (0-100) required for an FVG to generate a reversal signal. | 60 |
| continuationMaxScore | Continuation Signal Max Strength | int | Maximum initial composite score (0-100) for an FVG to be a candidate for an iFVG signal. | 40 |
| swingLeftBars | Swing Lookback Left | int | Number of bars to the left for pivot detection. | 5 |
| swingRightBars | Swing Lookback Right | int | Number of bars to the right for pivot detection. | 5 |
| showReversals | Show Reversal Signals | bool | Toggles the display of reversal signals. | true |
| showContinuations | Show Continuation Signals | bool | Toggles the display of continuation signals. | true |

### **6.2. Core Functions (Annotated Code)**

The logic will be organized into a series of modular functions to enhance readability and maintainability.

* **FVG Detection and Strength Calculation:**  
  Pine Script  
  // @function f\_detectAndScoreFVG  
  // @description Checks for a new FVG on the close of the current bar and calculates its strength.  
  // @returns A new 'fvg' object if an FVG is found, 'na' otherwise.  
  f\_detectAndScoreFVG() \=\>  
      // \--- Detection Logic \---  
      bool isBullFVG \= low \> high  
      bool isBearFVG \= high \< low

      if isBullFVG or isBearFVG  
          // \--- Strength Calculation \---  
          // 1\. Consistency Score  
          int consistencyScore \= (isBullFVG? (close \> open? 1 : 0\) \+ 1 \+ (close \> open? 1 : 0\) : (close \< open? 1 : 0\) \+ 1 \+ (close \< open? 1 : 0))

          // 2\. Magnitude Score  
          float fvgTop \= isBullFVG? low : low  
          float fvgBottom \= isBullFVG? high : high  
          float atr \= ta.atr(14)  
          float magnitudeScore \= atr \> 0? (fvgTop \- fvgBottom) / atr : 0

          // 3\. Volume Score  
          float avgVolume \= ta.sma(volume, 20\)  
          float volumeScore \= avgVolume \> 0? volume / avgVolume : 0

          // 4\. Composite Score (normalized to 0-100)  
          int compositeScore \= int( ( (consistencyScore / 3.0) \* consistencyWeight \+ magnitudeScore \* (magnitudeWeight / 100.0) \+ volumeScore \* (volumeWeight / 100.0) ) / ( (consistencyWeight \+ magnitudeWeight \+ volumeWeight) / 100.0 ) \* 100 )

          // \--- Create and return FVG object \---  
          if magnitudeScore \>= fvgAtrThreshold  
              fvg.new(fvgTop, fvgBottom, isBullFVG, bar\_index, compositeScore, "active")  
      else  
          na

* **FVG State Management:** This function will iterate through the fvgs\_active array on each bar to check for mitigation or inversion.  
  Pine Script  
  // @function f\_manageFVGState  
  // @description Updates the state of all active FVGs based on the current bar's close.  
  f\_manageFVGState(fvg\_array) \=\>  
      for i \= 0 to array.size(fvg\_array) \- 1  
          fvg currentFvg \= array.get(fvg\_array, i)  
          // Check for Bullish FVG Inversion  
          if currentFvg.isBullish and close \< currentFvg.bottom  
              currentFvg.state := "inverted"  
          // Check for Bearish FVG Inversion  
          if not currentFvg.isBullish and close \> currentFvg.top  
              currentFvg.state := "inverted"  
          // Check for Mitigation (full fill)  
          if (currentFvg.isBullish and high \> currentFvg.top) or (not currentFvg.isBullish and low \< currentFvg.bottom)  
              if currentFvg.state \== "active" // Only mitigate if not already inverted  
                  currentFvg.state := "mitigated"

### **6.3. Signal and Plotting Engine (Annotated Code)**

The signal logic will be contained within dedicated functions that are called on each bar.

* **Reversal Signal Detection:**  
  Pine Script  
  // @function f\_checkForReversalSignal  
  // @description Checks if a candlestick pattern has formed within a respected FVG.  
  f\_checkForReversalSignal(fvg\_instance) \=\>  
      bool isInsideFVG \= high \>= fvg\_instance.bottom and low \<= fvg\_instance.top  
      if isInsideFVG and fvg\_instance.state \== "active" and fvg\_instance.strengthScore \>= reversalMinScore  
          // \--- Bullish Reversal Check (inside a bullish FVG) \---  
          if fvg\_instance.isBullish  
              bool isBullEngulf \= close \> open and open \< close and close \> open and close \< open  
              //... add logic for Hammer, Piercing Line, etc.  
              if isBullEngulf // or isHammer or isPiercingLine...  
                  // Trigger Buy Reversal Signal  
                  label.new(bar\_index, low, "BUY\\nReversal", color=color.new(color.green, 20), textcolor=color.white, style=label.style\_label\_up)  
                  // Find and plot target  
          // \--- Bearish Reversal Check (inside a bearish FVG) \---  
          else  
              bool isBearEngulf \= close \< open and open \> close and close \< open and close \> open  
              //... add logic for Shooting Star, Dark Cloud Cover, etc.  
              if isBearEngulf // or isShootingStar...  
                  // Trigger Sell Reversal Signal  
                  label.new(bar\_index, high, "SELL\\nReversal", color=color.new(color.red, 20), textcolor=color.white, style=label.style\_label\_down)  
                  // Find and plot target

* **Plotting Engine:** A single function will handle all drawing to keep the main script body clean. It will iterate through the FVG array and draw boxes based on their state and properties.  
  Pine Script  
  // @function f\_drawObjects  
  // @description Draws FVG boxes on the chart.  
  f\_drawObjects(fvg\_array) \=\>  
      for fvg in fvg\_array  
          if fvg.startTime \>= timenow \- 86400000 \* 30 // Only draw recent FVGs for performance  
              color boxColor \= fvg.isBullish? color.new(color.green, 80\) : color.new(color.red, 80\)  
              if fvg.state \== "inverted"  
                  boxColor := color.new(color.yellow, 80\) // Change color for inverted FVGs  
              if fvg.state\!= "mitigated"  
                  box.new(fvg.startTime, fvg.top, bar\_index \+ 10, fvg.bottom, border\_color=boxColor, bgcolor=boxColor)

### **6.4. Leveraging Pine Script v6 Features**

Pine Script v6 introduces several features that enhance script performance and readability.

* **Strict Boolean Logic:** The change from trilean logic (true, false, na) to strict booleans (true, false) improves runtime efficiency. The script will use short-circuiting logical operators (and, or) in complex conditional checks, which prevents the evaluation of unnecessary expressions, speeding up execution on each bar.35  
* **Methods on UDTs:** To create a cleaner, more object-oriented structure, methods can be defined for the custom types. For example, a method on the fvg type could encapsulate the logic for checking if price is inside the FVG.  
  Pine Script  
  method isPriceInside(fvg f, float p) \=\>  
      p \>= f.bottom and p \<= f.top

This approach makes the code more intuitive and easier to debug compared to passing the object to a separate function.

## **Section 7: Practical Application and Synthesis**

The development of a sophisticated trading indicator is only complete when its practical application is clearly understood. This final section provides context on how to integrate the Ultimate FVG Indicator into a cohesive trading plan, illustrated with case studies. It also offers guidance on risk management and parameter optimization to adapt the tool to various market conditions and trading styles.

### **7.1. Case Studies: Chart Examples**

To illustrate the indicator's dual-framework logic, two common scenarios are examined.

* **Case Study 1: High-Probability Reversal Signal**  
  1. **Context:** The price is in a clear uptrend on a higher timeframe (e.g., 4-hour), but has pulled back to a key support level on the 1-hour chart.  
  2. **FVG Formation:** During the pullback, a bullish FVG forms. The indicator's analysis engine evaluates it:  
     * *Consistency:* All three candles are bullish (Score: 3/3).  
     * *Magnitude:* The FVG's height is 1.2x the 14-period ATR.  
     * *Volume:* The middle candle's volume is 1.8x the 20-period average.  
     * *Composite Score:* The indicator calculates a high score of 85/100, marking it as a significant zone of interest.  
  3. **Price Interaction:** Price retraces and enters the high-strength bullish FVG. The FVG holds as support; the price does not close below its lower boundary.  
  4. **Signal Generation:** While inside the FVG, a **Bullish Engulfing** pattern forms. The indicator detects this confluence and plots a "BUY Reversal" signal.  
  5. **Targeting:** Simultaneously, the indicator identifies the most recent significant swing high from the prior uptrend leg and plots a horizontal line at that level, labeled "Target." The calculated R/R ratio is displayed as 3.5:1, meeting a minimum threshold.  
* **Case Study 2: High-Momentum Continuation Signal**  
  1. **Context:** The market is in a strong, established downtrend.  
  2. **FVG Formation:** A minor pullback occurs, forming a small bullish FVG. The indicator's analysis engine evaluates it:  
     * *Consistency:* The candles are mixed (Score: 1/3).  
     * *Magnitude:* The FVG's height is only 0.6x the ATR.  
     * *Volume:* The volume on the middle candle is below average.  
     * *Composite Score:* The indicator calculates a low score of 25/100, identifying it as a weak, low-probability support zone.  
  3. **Inversion:** The downtrend resumes, and a strong bearish candle closes decisively below the low of the weak bullish FVG. The indicator updates the FVG's state to "inverted" and changes its color to yellow.  
  4. **Price Interaction:** Price briefly rallies, pulling back to retest the bottom of the now-inverted FVG, which is acting as new resistance.  
  5. **Signal Generation:** After the retest, a bearish candle closes. The indicator detects this rejection from the inverted zone and plots a "SELL Continuation" signal.  
  6. **Targeting:** The indicator identifies the most recent significant swing low of the downtrend and plots it as the "Target."

### **7.2. Integration into a Trading Plan**

This indicator is designed to be a powerful component of a broader trading strategy, not a standalone "black box" system. Its signals are most effective when used as confirmations within a structured trading plan.

* **Confluence is Key:** The highest-probability setups occur when the indicator's signals align with other technical factors. Traders should look for signals that form at:  
  * **Higher-Timeframe Points of Interest:** An FVG reversal signal is much stronger if it forms within a daily or weekly order block or at a major support/resistance level.9  
  * **Alignment with Market Structure:** A bullish reversal signal is more reliable if the overall market structure is bullish (e.g., making higher highs and higher lows). A continuation signal is strongest when it aligns with the prevailing trend.14  
  * **Liquidity Sweeps:** An FVG that forms immediately after sweeping liquidity from a previous high or low can be particularly potent, as it signals a true institutional move rather than a random fluctuation.16  
* **Risk Management:** Proper risk management is paramount. The structure of FVG and iFVG setups provides clear, logical locations for stop-loss orders.  
  * **For Reversal Trades:** A stop-loss should be placed just beyond the far boundary of the FVG being traded. For a bullish reversal, this would be just below the FVG's low.8  
  * **For Continuation Trades:** A stop-loss can be placed just beyond the iFVG zone, on the side opposite the trade direction. For a bearish continuation trade at a retested iFVG, the stop would go just above the iFVG's high.17  
  * The indicator's real-time R/R calculation should be used to ensure that only trades with a favorable risk profile are considered.

### **7.3. Recommendations for Parameter Optimization**

The indicator's parameters should be adjusted to fit the specific characteristics of the asset being traded and the individual's trading style.

* **Asset Type:** Highly liquid, volatile assets like major forex pairs or stock indices may benefit from stricter FVG thresholds (e.g., a higher fvgAtrThreshold) to filter out noise. Less volatile assets may require more sensitive settings.5  
* **Trading Style:**  
  * **Scalpers and Day Traders:** May prefer shorter lookback periods for swing detection (swingLeftBars/swingRightBars of 3-5) to identify short-term targets. They might also lower the reversalMinScore to see more potential setups on lower timeframes.4  
  * **Swing Traders:** Should use longer lookback periods (e.g., 8-15) to focus on major market structure points. They will benefit most from keeping the strength score thresholds high to filter for only the most significant FVG zones on 4-hour and daily charts.4

## **Section 8: Multi-Timeframe Confluence Analysis**

The most robust trading signals are rarely generated in isolation. They are typically the product of "confluence," where multiple, independent analytical factors align to point toward the same directional bias.37 To elevate the indicator's predictive power, a multi-timeframe (MTF) confluence module can be integrated. This module assesses each FVG not just on its own merits but also in the context of the broader market structure, as seen on higher and lower timeframes. This creates a "Confluence Meter" that adds a powerful layer of validation to the composite score.

### **8.1. Higher-Timeframe (HTF) FVG Alignment**

An FVG on the current chart (e.g., 15-minute) gains significant authority if it is nested within the boundaries of a larger FVG from a higher timeframe (e.g., 1-hour or 4-hour).37 This alignment signifies that both short-term and long-term institutional order flows are in sync, dramatically increasing the probability that the zone will be respected.7

* **Implementation:** Using Pine Script's request.security() function, the indicator can fetch the locations of active FVGs from a user-defined higher timeframe.38 When a new FVG is detected on the chart's timeframe, the script will check if its price range overlaps with any of the fetched HTF FVGs. It is crucial to use barmerge.lookahead\_off to prevent the script from repainting historical signals.39  
* **Scoring:** A binary score is assigned to this factor. If the current FVG is in confluence with an HTF FVG of the same direction, it receives a score of \+1; otherwise, it receives a score of 0\.

### **8.2. Lower-Timeframe (LTF) Momentum & Structure Confirmation**

While the higher timeframe provides the strategic context, the lower timeframe offers tactical precision for entries.37 After price enters an FVG on the current chart, the indicator can monitor a lower timeframe for a confirmation that momentum is shifting in the expected direction.

* **Implementation:** The request.security\_lower\_tf() function can be used to analyze price action on a faster timeframe.40 A classic confirmation signal is a "market structure shift" (MSS) on the LTF. For example, after price enters a bullish FVG on the 15-minute chart, the indicator would monitor the 1-minute chart. If the price then breaks above a recent 1-minute swing high, it confirms that buying pressure is emerging at the LTF level, validating the FVG.37 Another method is to monitor a momentum oscillator like the RSI on the LTF; a crossover from an oversold condition could serve as confirmation.41  
* **Scoring:** This factor can also be scored binarily. If a valid LTF confirmation signal occurs while price is inside the FVG, it receives a score of \+1; otherwise, it is 0\.

### **8.3. The Confluence Meter: An Enhanced Composite Score**

By integrating these multi-timeframe factors, the original composite score is transformed into a more comprehensive "Confluence Meter." This provides a single, at-a-glance rating of an FVG's quality, incorporating both its internal structure and its alignment with the broader market.

* Updated Formula: The new factors are added to the weighted average, with their own user-definable weights ($w\_{htf}$ for Higher-Timeframe Confluence and $w\_{ltf}$ for Lower-Timeframe Confirmation).  
  $CompositeScore\_{Confluence} \= (w\_{c} \\cdot Score\_{Consistency}) \+ (w\_{m} \\cdot Score\_{Magnitude}) \+ (w\_{v} \\cdot Score\_{Volume}) \+ (w\_{htf} \\cdot Score\_{HTF}) \+ (w\_{ltf} \\cdot Score\_{LTF})$  
* **Interpretation:** An FVG with a high confluence score is one that is not only well-formed (consistent candles, significant size, high volume) but also appears at a strategic price level (within an HTF FVG) and is validated by immediate price action (LTF momentum shift). This multi-layered validation helps filter out noise and isolate the highest-probability trading setups.39

The table below summarizes the enhanced scoring model, now including the confluence factors.

| Factor | Description | Calculation Method | Default Weight | Contribution to Score |
| :---- | :---- | :---- | :---- | :---- |
| **Consistency Theory** | Measures the directional alignment of the three candles forming the FVG. | Sum of directionally consistent candles (Score: 1-3). | 30% | Reflects the purity of the price displacement. |
| **Magnitude (vs. ATR)** | Normalizes the FVG's size against the market's recent volatility. | $Ratio \= \\frac{(FVG\_{High} \- FVG\_{Low})}{ta.atr(14)}$. | 20% | Quantifies the statistical significance of the imbalance. |
| **Volume Confirmation** | Compares the displacement candle's volume to the recent average. | $Ratio \= \\frac{volume}{ta.sma(volume, 20)}$. | 20% | Validates institutional participation. |
| **HTF Confluence** | Checks if the FVG is located within an FVG from a higher timeframe. | Binary score (1 for alignment, 0 for none). | 20% | Confirms alignment with the broader market trend. |
| **LTF Confirmation** | Checks for a market structure shift or momentum signal on a lower timeframe. | Binary score (1 for confirmation, 0 for none). | 10% | Provides tactical confirmation for entry timing. |

By combining a deep understanding of the underlying market mechanics with the quantitative and logical frameworks detailed in this report, a trader can effectively build and deploy this ultimate FVG indicator to gain a significant edge in analyzing and executing trades based on market inefficiencies.

#### **Works cited**

1. trendspider.com, accessed November 2, 2025, [https://trendspider.com/learning-center/fair-value-gap-trading-strategy/\#:\~:text=A%20fair%20value%20gap%20(FVG,be%20used%20as%20reliable%20ones.](https://trendspider.com/learning-center/fair-value-gap-trading-strategy/#:~:text=A%20fair%20value%20gap%20\(FVG,be%20used%20as%20reliable%20ones.)  
2. What is Fair Value Gap and how to use it in trading? \- Purple Trading, accessed November 2, 2025, [https://www.purple-trading.com/what-is-fair-value-gap-and-how-to-use-it-in-trading/](https://www.purple-trading.com/what-is-fair-value-gap-and-how-to-use-it-in-trading/)  
3. Fair Value Gap Strategy to Find Better Trades with FBS, accessed November 2, 2025, [https://fbs.com/fbs-academy/traders-blog/fair-value-gap](https://fbs.com/fbs-academy/traders-blog/fair-value-gap)  
4. Fair Value Gap (FVG): A Complete Trading Guide (2025) \- XS, accessed November 2, 2025, [https://www.xs.com/en/blog/fair-value-gap/](https://www.xs.com/en/blog/fair-value-gap/)  
5. Fair value gap trading strategy: How to identify and use FVGs | Capital.com, accessed November 2, 2025, [https://capital.com/en-int/learn/trading-strategies/fair-value-gap](https://capital.com/en-int/learn/trading-strategies/fair-value-gap)  
6. FVG Pine Script | PDF | Market Trend | Computer Programming \- Scribd, accessed November 2, 2025, [https://www.scribd.com/document/820137190/FVG-Pine-Script](https://www.scribd.com/document/820137190/FVG-Pine-Script)  
7. Scripts Search Results for "fvg" \- TradingView, accessed November 2, 2025, [https://www.tradingview.com/scripts/search/fvg/](https://www.tradingview.com/scripts/search/fvg/)  
8. Boost Your Trading Edge with the Fair Value Gap Strategy \- FTMO, accessed November 2, 2025, [https://ftmo.com/en/boost-your-trading-edge-with-the-fair-value-gap-strategy/](https://ftmo.com/en/boost-your-trading-edge-with-the-fair-value-gap-strategy/)  
9. Exposing Price Inefficiencies: The Role of Fair Value Gaps (FVG) \- TradingView, accessed November 2, 2025, [https://www.tradingview.com/chart/SOLUSDT.P/QALwu0WI-Exposing-Price-Inefficiencies-The-Role-of-Fair-Value-Gaps-FVG/](https://www.tradingview.com/chart/SOLUSDT.P/QALwu0WI-Exposing-Price-Inefficiencies-The-Role-of-Fair-Value-Gaps-FVG/)  
10. Rohitict | PDF | Market Liquidity \- Scribd, accessed November 2, 2025, [https://www.scribd.com/document/829500233/rohitict](https://www.scribd.com/document/829500233/rohitict)  
11. Inversion Fair Value Gaps (IFVG) | Trading Indicator | LuxAlgo, accessed November 2, 2025, [https://www.luxalgo.com/library/indicator/inversion-fair-value-gaps-ifvg/](https://www.luxalgo.com/library/indicator/inversion-fair-value-gaps-ifvg/)  
12. Fair Value Gap Trading Strategy \- QuantifiedStrategies.com, accessed November 2, 2025, [https://www.quantifiedstrategies.com/fair-value-gap-trading-strategy/](https://www.quantifiedstrategies.com/fair-value-gap-trading-strategy/)  
13. FVG Price & Volume Graph | Trading Indicator \- LuxAlgo, accessed November 2, 2025, [https://www.luxalgo.com/library/indicator/fvg-price-volume-graph/](https://www.luxalgo.com/library/indicator/fvg-price-volume-graph/)  
14. Understanding the Inverse Fair Value Gap (IFVG) in Trading | Market Pulse \- FXOpen UK, accessed November 2, 2025, [https://fxopen.com/blog/en/what-is-an-inverse-fair-value-gap-ifvg-concept-in-trading/](https://fxopen.com/blog/en/what-is-an-inverse-fair-value-gap-ifvg-concept-in-trading/)  
15. Inversionfairvaluegap — Indicators and Strategies — TradingView — India, accessed November 2, 2025, [https://in.tradingview.com/scripts/inversionfairvaluegap/](https://in.tradingview.com/scripts/inversionfairvaluegap/)  
16. Inversion Fair Value Gap (iFVG) Trading Guide for 2025 \- HowToTrade, accessed November 2, 2025, [https://howtotrade.com/blog/inverse-fair-value-gap/](https://howtotrade.com/blog/inverse-fair-value-gap/)  
17. Inverse Fair Value Gap: What Is It and How Does It Work? \- XS, accessed November 2, 2025, [https://www.xs.com/en/blog/inverse-fair-value-gap/](https://www.xs.com/en/blog/inverse-fair-value-gap/)  
18. Inverse Fair Value Gap: Definition, Examples, and Strategy | EBC Financial Group, accessed November 2, 2025, [https://www.ebc.com/forex/inverse-fair-value-gaps-in-smc-how-to-trade-efficiently](https://www.ebc.com/forex/inverse-fair-value-gaps-in-smc-how-to-trade-efficiently)  
19. Pine Script Engulfing Candlestick Patterns \- Complete TradingView ..., accessed November 2, 2025, [https://offline-pixel.github.io/pinescript-strategies/pine-script-engulfing.html](https://offline-pixel.github.io/pinescript-strategies/pine-script-engulfing.html)  
20. Pine Script Hammer Candlestick Patterns \- Complete TradingView Guide, accessed November 2, 2025, [https://offline-pixel.github.io/pinescript-strategies/pine-script-hammer.html](https://offline-pixel.github.io/pinescript-strategies/pine-script-hammer.html)  
21. Hammer Algo Strategy for TradingView \- MyCoder, accessed November 2, 2025, [https://kb.mycoder.pro/apibridge/hammer-algo-strategy-for-tradingview/](https://kb.mycoder.pro/apibridge/hammer-algo-strategy-for-tradingview/)  
22. Pine Script Piercing Line Candlestick Patterns \- AI Product Builder, accessed November 2, 2025, [https://offline-pixel.github.io/pinescript-strategies/pine-script-piercing-line.html](https://offline-pixel.github.io/pinescript-strategies/pine-script-piercing-line.html)  
23. Pine Script Morning Star Candlestick Patterns \- Complete ..., accessed November 2, 2025, [https://offline-pixel.github.io/pinescript-strategies/pine-script-morning-star.html](https://offline-pixel.github.io/pinescript-strategies/pine-script-morning-star.html)  
24. Indicator: "Morning Star Pattern" | PDF \- Scribd, accessed November 2, 2025, [https://www.scribd.com/document/865819509/4-5868339375598738991](https://www.scribd.com/document/865819509/4-5868339375598738991)  
25. Pine Script Shooting Star Candlestick Patterns \- Complete TradingView Guide, accessed November 2, 2025, [https://offline-pixel.github.io/pinescript-strategies/pine-script-shooting-star.html](https://offline-pixel.github.io/pinescript-strategies/pine-script-shooting-star.html)  
26. Shooting Star — Indicators and Strategies \- TradingView, accessed November 2, 2025, [https://www.tradingview.com/scripts/shootingstar/](https://www.tradingview.com/scripts/shootingstar/)  
27. Pine Script Dark Cloud Cover Candlestick Patterns \- Complete ..., accessed November 2, 2025, [https://offline-pixel.github.io/pinescript-strategies/pine-script-dark-cloud-cover.html](https://offline-pixel.github.io/pinescript-strategies/pine-script-dark-cloud-cover.html)  
28. Dark Cloud Cover: A Trader's Guide | TrendSpider Learning Center, accessed November 2, 2025, [https://trendspider.com/learning-center/dark-cloud-cover-a-traders-guide/](https://trendspider.com/learning-center/dark-cloud-cover-a-traders-guide/)  
29. Evening Star \- Bearish — TradingView, accessed November 2, 2025, [https://www.tradingview.com/support/solutions/43000583772-evening-star-bearish/](https://www.tradingview.com/support/solutions/43000583772-evening-star-bearish/)  
30. EveningStar, accessed November 2, 2025, [http://www.aspenres.com/documents/aspengraphics4.0/EveningStar.htm](http://www.aspenres.com/documents/aspengraphics4.0/EveningStar.htm)  
31. Swing High Low Pine Script Version 6 | PDF \- Scribd, accessed November 2, 2025, [https://www.scribd.com/document/866446450/swing-High-Low-pine-script-version-6](https://www.scribd.com/document/866446450/swing-High-Low-pine-script-version-6)  
32. Scripts Search Results for "swing high low" \- TradingView, accessed November 2, 2025, [https://www.tradingview.com/scripts/search/swing%20high%20low/](https://www.tradingview.com/scripts/search/swing%20high%20low/)  
33. pine script \- Swing High/Low tracking to find out the bias \- Stack Overflow, accessed November 2, 2025, [https://stackoverflow.com/questions/79335898/swing-high-low-tracking-to-find-out-the-bias](https://stackoverflow.com/questions/79335898/swing-high-low-tracking-to-find-out-the-bias)  
34. Swing Charting \- Unofficed, accessed November 2, 2025, [https://unofficed.com/courses/bounce/lessons/swing-charting/](https://unofficed.com/courses/bounce/lessons/swing-charting/)  
35. Pine Script™ v6: What's New and Why It Matters \- TradersPost Blog, accessed November 2, 2025, [https://blog.traderspost.io/article/pine-script-tm-v6-whats-new-and-why-it-matters](https://blog.traderspost.io/article/pine-script-tm-v6-whats-new-and-why-it-matters)  
36. Thoughts on Pine Script v6? : r/TradingView \- Reddit, accessed November 2, 2025, [https://www.reddit.com/r/TradingView/comments/1gulj32/thoughts\_on\_pine\_script\_v6/](https://www.reddit.com/r/TradingView/comments/1gulj32/thoughts_on_pine_script_v6/)  
37. Swing Trader's Toolkit: Multi-Timeframe & Institutional Confluence \- ACY Securities, accessed November 2, 2025, [https://acy.com/en/market-news/education/swing-trader-toolkit-j-o-20251010-091542/](https://acy.com/en/market-news/education/swing-trader-toolkit-j-o-20251010-091542/)  
38. How to Use Multi-Timeframe Analysis in Pine Script? | by Ranga Technologies | Oct, 2025, accessed November 2, 2025, [https://rangatechnologies.medium.com/how-to-use-multi-timeframe-analysis-in-pine-script-190cdb846b46](https://rangatechnologies.medium.com/how-to-use-multi-timeframe-analysis-in-pine-script-190cdb846b46)  
39. How to Use Multi-Timeframe Analysis in Pine Script (A Complete Guide) \- Medium, accessed November 2, 2025, [https://medium.com/@betashorts1998/how-to-use-multi-timeframe-analysis-in-pine-script-a-complete-guide-a513d3f5195b](https://medium.com/@betashorts1998/how-to-use-multi-timeframe-analysis-in-pine-script-a-complete-guide-a513d3f5195b)  
40. Other data and timeframes \- TradingView, accessed November 2, 2025, [https://www.tradingview.com/pine-script-docs/faq/other-data-and-timeframes/](https://www.tradingview.com/pine-script-docs/faq/other-data-and-timeframes/)  
41. Building a Momentum Scalper That Listens to Multiple Timeframes | by Betashorts \- Medium, accessed November 2, 2025, [https://medium.com/@betashorts1998/building-a-momentum-scalper-that-listens-to-multiple-timeframes-050c1dd3c81e](https://medium.com/@betashorts1998/building-a-momentum-scalper-that-listens-to-multiple-timeframes-050c1dd3c81e)