'use strict';

document.getElementById('student-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name:      document.getElementById('name').value,
        gender:    document.getElementById('gender').value,
        semester:  document.getElementById('semester').value,
        academicYear:  document.getElementById('academicYear').value,
        grades: {
            islamic: +document.getElementById('islamic').value,
            arabic:  +document.getElementById('arabic').value,
            math:    +document.getElementById('math').value,
            science: +document.getElementById('science').value,
            civic:   +document.getElementById('civic').value,
            french:  +document.getElementById('french').value,
            sport:   +document.getElementById('sport').value,
            art:     +document.getElementById('art').value,
            conduct: +document.getElementById('conduct').value,
        }
    };

    const res = await fetch('/api/v1/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    
    if (result.success) {
        // انتقل لصفحة النتيجة
        window.location.href = `/certificates.html`;
    } else {
        alert(result.message);
    }
});
    