import React from 'react';

const WizardSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Requirements' },
    { number: 2, title: 'AI Design Preview' },
    { number: 3, title: 'Finalize & Download' }
  ];

  return (
    <div style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div style={styles.stepWrapper}>
            <div
              style={{
                ...styles.stepCircle,
                ...(currentStep >= step.number ? styles.stepActive : {})
              }}
            >
              {step.number}
            </div>
            <div style={styles.stepTitle}>{step.title}</div>
          </div>
          {index < steps.length - 1 && (
            <div
              style={{
                ...styles.connector,
                ...(currentStep > step.number ? styles.connectorActive : {})
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2rem 0',
    padding: '1rem'
  },
  stepWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  stepCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#BDC3C7',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  },
  stepActive: {
    backgroundColor: '#3498DB',
    transform: 'scale(1.1)'
  },
  stepTitle: {
    fontSize: '0.9rem',
    color: '#2C3E50',
    fontWeight: '500'
  },
  connector: {
    width: '100px',
    height: '4px',
    backgroundColor: '#BDC3C7',
    margin: '0 1rem',
    marginBottom: '25px',
    transition: 'all 0.3s'
  },
  connectorActive: {
    backgroundColor: '#3498DB'
  }
};

export default WizardSteps;
