# ME 418 — Final Exam Topics
**California Polytechnic State University | Professor Brendon Anderson**

> This document organizes all concepts from Labs 1A, 1B, 2, 3A, 3B, 4, 5A, and 5B by exam station type.

---

## 📝 Station 1: Pen and Paper

### System Modeling & Transfer Functions
- Write the transfer function for a **first-order system**: `G(s) = K / (tau*s + 1)`
- Write the transfer function for a **second-order system**: `G(s) = K*wn² / (s² + 2ζωₙs + ωₙ²)`
- Derive the mass-damper ODE: `m·dv/dt + b·v = F`
- Convert an ODE to a transfer function using Laplace transform
- Combine two first-order systems in series: `G_total(s) = G1(s) * G2(s)`

### Step Response Analysis (by hand)
- **Time constant (τ)**: time to reach 63.2% of final value
- **Steady-state gain (K)**: `K = output_ss / input_magnitude`
- **Settling time**: approximately `4τ` (2% criterion)
- **Percent overshoot**: `%OS = (peak - final) / final × 100%`
- Predict response shape given ζ:
  - ζ > 1: overdamped (no oscillation, slow)
  - ζ = 1: critically damped (fastest no-overshoot)
  - 0 < ζ < 1: underdamped (oscillatory)
  - ζ = 0: undamped (oscillates forever)

### Closed-Loop Analysis
- **Closed-loop TF**: `T(s) = G(s) / (1 + G(s))` for unity feedback
- **Open-loop TF**: `L(s) = C(s) · G(s)`
- **Steady-state error** (P-only, type-0 plant): `e_ss = 1 / (1 + Kp · K_plant)`
- **% Steady-state error**: `|ref - output_ss| / ref × 100%`
- Find closed-loop poles: set denominator of T(s) = 0, solve

### PID Controller Math
- **P**: `u = Kp · e`
- **PD**: `u = Kp · e + Kd · ė`
- **PI**: `u = Kp · e + Ki · ∫e dt`
- **PID**: `u = Kp · e + Ki · ∫e dt + Kd · ė`
- **PID as TF**: `C(s) = Kp + Ki/s + Kd·s = (Kd·s² + Kp·s + Ki) / s`
- Compute PID zeros z1, z2: roots of `Kd·s² + Kp·s + Ki = 0`
- With `Kp=100, Ki=350, Kd=5.6`: find z1 and z2

### DC Motor Model (hand calculations — Lab 3B style)
- Motor model: `G_motor(s) = Kss / (tau·s + 1)` where `Kss = 38.5`, `τ = 0.23 s`
- Motor driver gain: `24V / 100% = 0.24 V/%`
- Motor + driver: `G(s) = 11.04 / (0.23s + 1)`
- PI controller: `C(s) = (Kp·s + Ki) / s`
- Compute open-loop: `L(s) = C(s) · G(s)`
- Compute closed-loop: `T(s) = L(s) / (1 + L(s))`
- Find poles of T(s), determine stability and damping

### Stability (Pole Locations)
- Poles in **left half plane** (negative real part) → **stable**
- Both poles **real and negative** → overdamped
- Complex conjugate poles (negative real) → underdamped (oscillatory, stable)
- Pole on imaginary axis → marginally stable
- Pole in right half plane → unstable

### Effects of Gains on Response
| Increase | Rise Time | Overshoot | Settling Time | SS Error |
|----------|-----------|-----------|---------------|----------|
| Kp ↑ | Decrease | Increase | Small change | Decrease |
| Ki ↑ | Decrease | Increase | Increase | Eliminate |
| Kd ↑ | Small | Decrease | Decrease | No change |

---

## 💻 Station 2: MATLAB / Simulink

### Simulink Block Diagrams
- Build open-loop model: connect Step block → Transfer Function block → Scope
- Build closed-loop model: Summing junction → Controller TF → Plant TF → feedback to summing junction
- Add **Saturation block** to model actuator limits
- Use **Transfer Function block** for first/second-order systems
- Connect two TFs in series (multiply numerators and denominators)
- Set simulation **Stop Time** and **Solver** appropriately

### Transfer Function in MATLAB
```matlab
% First-order
K = 38.5; tau = 0.23;
G = tf(K, [tau, 1]);

% Second-order (pendulum)
wn = 6.7; zeta = 0.41; Kss = 0.018;
num = Kss * wn^2;
den = [1, 2*zeta*wn, wn^2];
G = tf(num, den);

% PID controller
Kp = 100; Ki = 350; Kd = 5.6;
C = tf([Kd, Kp, Ki], [1, 0]);

% Closed-loop
T = feedback(C*G, 1);
step(T);
```

### Bode Plots (Lab 5A)
```matlab
wn = 6.7; zeta = 0.41; Kss = 0.018;
num = Kss * wn^2;
den = [1, 2*zeta*wn, wn^2];
G = tf(num, den);
bode(G);
grid on;
```
- Tune `wn` → shifts resonant peak left/right
- Tune `zeta` → changes sharpness of resonant peak
- Tune `Kss` → shifts entire magnitude plot up/down
- Reliable experimental range: **2–6 Hz** for pendulum

### Root Locus (Lab 5B)
```matlab
% PID zeros
Kp = 100; Ki = 350; Kd = 5.6;
z = roots([Kd, Kp, Ki]);   % z1, z2

% rltool — add PID zeros z1, z2 and pole at origin
rltool(G)
```
- Add PID zeros and integrator pole (s = 0) to rltool
- Select gain on root locus to achieve desired pole locations
- Verify closed-loop response with step()

### Plotting in MATLAB
```matlab
t = out.tout;
v = out.vel;
figure;
plot(t, v, 'LineWidth', 1.5);
grid on;
title('Velocity vs Time');
xlabel('Time (s)');
ylabel('Velocity (rad/s)');
```

### Key Simulink Exercises to Know
- **Lab 1A**: Open-loop first/second-order step response
- **Lab 1B**: Closed-loop tank control with P controller; saturation effects
- **Lab 3A**: DC motor step response model validation
- **Lab 3B**: PI velocity controller with unity feedback
- **Lab 5A**: Bode plot overlay (theoretical vs experimental)
- **Lab 5B**: Root locus with PID zeros, step response validation

---

## 🐍 Station 3: Python / Jupyter Notebook

### Core Python Skills
```python
# Fibonacci warmup (Lab 2)
def fibonacci(n):
    a, b = 0, 1
    total = 0
    for _ in range(n):
        total += a
        a, b = b, a + b
    return a, total   # nth Fibonacci, sum of first n

# P Controller
def p_control(Kp, e):
    return Kp * e

# PD Controller
def pd_control(Kp, Kd, e, e_prev, dt):
    e_dot = (e - e_prev) / dt
    return Kp * e + Kd * e_dot
```

### PI Controller Class (Lab 3B pattern)
```python
class Controller:
    def __init__(self, Kp=0, Ki=0):
        self.Kp = Kp
        self.Ki = Ki
        self.setpoint = 0
        self.integral = 0

    def set_setpoint(self, sp):
        self.setpoint = sp

    def set_gains(self, Kp, Ki):
        self.Kp = Kp
        self.Ki = Ki

    def run(self, current_velocity, dt):
        e = self.setpoint - current_velocity
        self.integral += e * dt
        return self.Kp * e + self.Ki * self.integral
```

### Trapezoidal Velocity Profile Generator (Lab 4 pattern)
```python
def trapz_profile_gen(v_max, t_accel, t_ss, t_stop, dt):
    """Generator that yields velocity setpoints for trapezoidal profile."""
    # Ramp up
    t = 0
    while t < t_accel:
        yield v_max * t / t_accel
        t += dt
    # Constant
    while t < t_accel + t_ss:
        yield v_max
        t += dt
    # Ramp down
    while t < t_accel + t_ss + t_stop:
        yield v_max * (t_accel + t_ss + t_stop - t) / t_stop
        t += dt

def trapz_profile_length(t_accel, t_ss, t_stop, dt):
    return int((t_accel + t_ss + t_stop) / dt)
```

### Sine Sweep / Bode Plot Analysis (Lab 5A pattern)
```python
import numpy as np
import matplotlib.pyplot as plt

# Compute FFT-based frequency response
f_input = np.fft.fft(input_signal)
f_output = np.fft.fft(output_signal)
H = f_output / f_input
freqs = np.fft.fftfreq(len(input_signal), d=dt)

# Plot magnitude
plt.subplot(2,1,1)
plt.semilogx(freqs[:N//2], 20*np.log10(np.abs(H[:N//2])))
plt.ylabel('Magnitude (dB)')
plt.grid(True)

# Plot phase
plt.subplot(2,1,2)
plt.semilogx(freqs[:N//2], np.angle(H[:N//2], deg=True))
plt.ylabel('Phase (deg)')
plt.grid(True)
```

### MicroPython Hardware Code (STM32)
```python
import utime
from motor import Motor
from encoder import Encoder

motor = Motor()
encoder = Encoder()

# Timed sampling at 500 Hz
dt_us = 2000  # 2 ms = 500 Hz
t_start = utime.ticks_us()
t_last = t_start
velocities = []

while utime.ticks_diff(utime.ticks_us(), t_start) < 2_000_000:
    now = utime.ticks_us()
    if utime.ticks_diff(now, t_last) >= dt_us:
        vel = encoder.get_velocity()
        velocities.append(vel)
        t_last = now
```

### Key Concepts to Know in Python
- **P control**: `u = Kp * e`
- **PD control**: `u = Kp*e + Kd*(e - e_prev)/dt`
- **PI control class**: `__init__`, `set_setpoint`, `set_gains`, `run` methods
- **Generator functions**: use `yield` for profile generator
- **Integral accumulation**: `integral += e * dt` inside control loop
- **Settling time**: detect when `|output - setpoint| / setpoint < 0.02` and stays there
- **Percent overshoot**: `%OS = (max(output) - final) / final * 100`
- **Plotting**: `plt.plot()`, `plt.xlabel()`, `plt.ylabel()`, `plt.grid()`, `plt.legend()`

---

## 🔧 Station 4: Hardware

### Equipment
- **Microcontroller**: STM32
- **Motor**: DC motor (24V max via motor driver)
- **Sensor**: Rotary encoder (measures angular velocity/position)
- **IDE**: Thonny (upload MicroPython .py files)
- **Motor driver gain**: 24V / 100% = 0.24 V per percent command

### Step Response Test Procedure (Lab 3A)
1. Connect STM32 to motor and encoder
2. Upload `motor.py` and `encoder.py` to STM32 via Thonny
3. Write and upload `main.py`:
   - Apply 100% voltage step (24V)
   - Sample encoder at **500 Hz** (every 2 ms)
   - Use `utime.ticks_us()` and `utime.ticks_diff()` for timing
   - Store data in queues
4. Transmit data to PC via serial
5. Plot in Jupyter Notebook → identify K and τ

### Closed-Loop Velocity Control Procedure (Lab 3B)
1. Complete `controller.py` OOP class (PI gains, run method)
2. Upload to STM32 via Thonny
3. Run `main.py` closed-loop step response test
4. Compare P-only, I-only, and PI responses
5. Identify saturation on controller output plot (flattens at ±100%)

### Tracking Control Procedure (Lab 4)
1. Complete `profile.py` with `trapz_profile_gen()` and `trapz_profile_length()`
2. Upload to STM32 via Thonny
3. Run `main.py`: iterate through velocity profile, run PI controller
4. Overlay ideal profile vs actual response in Jupyter

### Sine Sweep Procedure (Lab 5A)
1. Apply sine sweep input (2–10 Hz range) via STM32
2. Record angular response with encoder
3. Transfer data to Jupyter Notebook
4. Compute experimental Bode plots
5. Overlay with theoretical second-order TF in MATLAB

### PID Position Control Procedure (Lab 5B)
1. Implement PID in `main.py` for pendulum position control
2. **Tuning order**: Kp first → then Kd → then Ki
3. Apply step input, observe and record response
4. Reduce sampling rate if Kd causes noise-induced vibration
5. Verify controller output stays below saturation limit

### Common Hardware Pitfalls
- **Timing errors**: Must use `utime.ticks_diff()`, not subtraction (ticks can wrap)
- **Encoder noise**: Becomes a problem with high Kd gains
- **Motor driver saturation**: Output clamps at ±100% voltage command
- **Thonny upload**: Always save and upload new .py file before running
- **Serial data loss**: Queues can overflow if printing inside tight loop
- **Friction and backlash**: Real motor behavior differs from first-order model

---

## 🔑 Quick Reference: Key Numbers

| Parameter | Value | Source |
|-----------|-------|--------|
| DC Motor Kss | 38.5 rad/s/V | Lab 3A step response |
| DC Motor τ | 0.23 s | Lab 3A (63.2% of 925 rad/s) |
| DC Motor steady-state ω | 925 rad/s at 24V | Lab 3A |
| Motor driver gain | 0.24 V/% | 24V / 100% |
| Sampling rate | 500 Hz (2 ms) | Lab 3A/3B/4 |
| Pendulum wn | 6.7 rad/s | Lab 5A sine sweep |
| Pendulum ζ | 0.41 | Lab 5A sine sweep |
| Pendulum Kss | 0.018 | Lab 5A sine sweep |
| Reliable sweep range | 2–6 Hz | Lab 5A |
| Optimal PI (velocity) | Kp=0.19, Ki=0.5 | Lab 3B/4 |
| Optimal PID (position) | Kp=100, Ki=350, Kd=5.6 | Lab 5B |

---

## 📋 Concept Checklist by Lab

| Lab | Station | Key Skill |
|-----|---------|-----------|
| 1A | MATLAB/Simulink | Build Simulink open-loop models, identify 1st/2nd order behavior |
| 1A | Pen & Paper | Compute τ, K, predict effect of parameter changes |
| 1B | MATLAB/Simulink | Closed-loop block diagram, saturation effects, PID actions |
| 1B | Pen & Paper | Steady-state error formula, closed-loop poles |
| 2 | Python | Implement P/PD controller in Python simulation loop |
| 2 | Python | Write Fibonacci function, compute %OS and settling time |
| 3A | Hardware | Step response test procedure, timed sampling with utime |
| 3A | Python/Jupyter | Plot step response, identify K and τ from plot |
| 3A | MATLAB/Simulink | Build and validate Simulink model with experimental data |
| 3B | Python | OOP PI controller class (MicroPython) |
| 3B | Hardware | Deploy and test P/I/PI on STM32 |
| 3B | Pen & Paper | Derive CL TF, find poles, determine overdamped/underdamped |
| 3B | MATLAB/Simulink | PI + motor Simulink model with unity feedback |
| 4 | Python | Trapezoidal velocity profile generator function |
| 4 | Hardware | Upload and run tracking control experiment |
| 4 | Pen & Paper | Explain ramp tracking error and why it's not eliminated during acceleration |
| 5A | Hardware | Apply sine sweep, collect Bode data |
| 5A | Python/Jupyter | Compute FFT, generate Bode plots |
| 5A | MATLAB | Fit second-order TF to experimental Bode (tune wn, ζ, Kss) |
| 5B | Hardware | Sequential PID tuning on pendulum |
| 5B | MATLAB | Root locus with rltool, compute z1/z2 PID zeros |
| 5B | Pen & Paper | PID zero calculation, pole placement reasoning |
