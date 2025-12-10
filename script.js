// Basic client-side processing to compute BMI and provide simple recommendations.
// This file runs entirely in the browser; no data is sent anywhere.

(function () {
  const form = document.getElementById('healthForm');
  const result = document.getElementById('result');
  const resetBtn = document.getElementById('resetBtn');

  function computeBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm) return null;
    const h = heightCm / 100;
    return +(weightKg / (h * h)).toFixed(1);
  }

  function classifyBMI(bmi) {
    if (bmi === null) return 'unknown';
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  function recommendations({name, age, gender, bmi, bmiClass, activity, dietPref, goal}) {
    const recs = {
      shortGreeting: name ? `Hi ${name}!` : 'Hello!',
      bmiText: bmi ? `Your BMI is ${bmi} (${bmiClass}).` : 'BMI data incomplete.',
      diet: [],
      habits: []
    };

    // Basic diet suggestions based on goal and dietary preference
    if (goal === 'lose') {
      recs.diet.push('Aim for a moderate calorie deficit: reduce portion sizes and choose whole foods.');
      if (dietPref === 'vegetarian' || dietPref === 'vegan') {
        recs.diet.push('Focus on legumes, tofu/tempeh, whole grains, and plenty of vegetables.');
      } else if (dietPref === 'lowcarb' || dietPref === 'keto') {
        recs.diet.push('Prioritise lean proteins, vegetables, and healthy fats; watch overall calories.');
      } else {
        recs.diet.push('Lean proteins (chicken, fish), whole grains, and lots of vegetables.');
      }
    } else if (goal === 'gain') {
      recs.diet.push('Increase calorie intake with nutrient-dense foods and add protein at each meal.');
      recs.diet.push('Include strength training and evenly spaced protein to support muscle growth.');
    } else if (goal === 'maintain') {
      recs.diet.push('Maintain balanced portions: vegetables, a protein source, healthy fats, and whole grains.');
    } else {
      recs.diet.push('Focus on balanced meals and small, sustainable changes (more vegetables, less processed food).');
    }

    // Simple BMI-specific guidance
    if (bmiClass === 'underweight') {
      recs.diet.push('Increase calories with healthy snacks: nuts, smoothies, whole milk yogurt, avocados.');
      recs.habits.push('Check with a clinician if unexpected weight loss.');
    } else if (bmiClass === 'normal') {
      recs.habits.push('Keep up the good work — maintain balanced meals and regular activity.');
    } else if (bmiClass === 'overweight' || bmiClass === 'obese') {
      recs.habits.push('Aim for gradual weight loss: 0.25–0.5 kg per week through small, consistent changes.');
      recs.habits.push('Limit sugary drinks and highly processed snacks.');
    }

    // Activity-based suggestions
    if (activity === 'sedentary') {
      recs.habits.push('Try to increase daily movement: short walks, standing breaks, and light exercise 3×/week.');
    } else if (activity === 'light') {
      recs.habits.push('Build consistency: aim for 30 minutes of moderate movement most days.');
    } else if (activity === 'moderate' || activity === 'active' || activity === 'very') {
      recs.habits.push('Great — keep progressive overload in strength work or vary cardio types to avoid plateaus.');
    }

    // General healthy habits
    recs.habits.push('Stay hydrated (aim for water across the day).');
    recs.habits.push('Prioritise 7–9 hours of sleep and manage stress with short breaks or breathing exercises.');
    recs.habits.push('Schedule regular checkups and consult a registered dietitian or doctor for personalized plans.');

    return recs;
  }

  function renderResult(data) {
    const rec = recommendations(data);
    result.innerHTML = `
      <h3>${rec.shortGreeting}</h3>
      <p style="color:var(--muted); margin-top:6px">${rec.bmiText}</p>

      <div class="reco" style="margin-top:12px">
        <div class="section">
          <strong>Diet suggestions</strong>
          <ul id="dietList" style="margin:8px 0 0 18px; padding:0">
            ${rec.diet.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>

        <div class="section" style="margin-top:8px">
          <strong>Daily health habits</strong>
          <ul id="habitList" style="margin:8px 0 0 18px; padding:0">
            ${rec.habits.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top:10px; font-size:13px; color:var(--muted)">
          <em>Tip:</em> These are general suggestions. For medical conditions, allergies, pregnancy, or complex needs consult a healthcare professional.
        </div>
      </div>
    `;
    result.classList.remove('visually-hidden');
    result.scrollIntoView({behavior:'smooth', block:'center'});
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value, 10) || null;
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value) || null;
    const height = parseFloat(document.getElementById('height').value) || null;
    const activity = document.getElementById('activity').value;
    const dietPref = document.getElementById('dietPref').value;
    const goal = document.getElementById('goal').value;

    const bmi = computeBMI(weight, height);
    const bmiClass = classifyBMI(bmi);

    renderResult({name, age, gender, bmi, bmiClass, activity, dietPref, goal});
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    result.classList.add('visually-hidden');
    result.innerHTML = '';
  });
})();
