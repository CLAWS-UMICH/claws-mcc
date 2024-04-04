function CheckError(data:any) {
    // Primary Oxygen
    if (20 <= data.oxy_pri_storage && data.oxy_pri_storage <= 80) {
        console.log("Don't know yet");
    }

    // Heart Rate
    if (data.heart_rate < 50 || data.heart_rate > 160) {
        console.log("Alert");
    }

    
    // Suit Pressure for O2
    if (600 < data.oxy_pri_pressure && data.oxy_pri_pressure < 3000) {
        console.log("Swap to secondary");
    } else if (600 < data.oxy_sec_pressure && data.oxy_sec_pressure < 3000) {
        console.log("Swap to primary");
    }

    // Suit Pressure for CO2
    if (0.0 < data.suit_pressure_co2 && data.suit_pressure_co2 < 0.1) {
        console.log("Vent out the CO2");
    }

    // Suit Pressure for Other Gases
    if (0.0 < data.suit_pressure_other && data.suit_pressure_other < 0.5) {
        console.log("Decompress and then Alert the User");
    }

    // Suit Pressure Total
    if (3.5 < data.suit_pressure_total && data.suit_pressure_total < 4.5) {
        console.log("Review other values");
    }
}


let test_data = {
    "oxy_pri_storage": 15,
    "heart_rate": 45,
    "oxy_pri_pressure": 500,
    "oxy_sec_pressure": 3500,
    "suit_pressure_co2": 0.05,
    "suit_pressure_other": 0.3,
    "suit_pressure_total": 4.0,
    "helmet_pressure_co2": 0.12,
    "fan_pri_rpm": 25000,
    "fan_sec_rpm": 28000,
    "scrubber_a_co2_storage": 65,
    "scrubber_b_co2_storage": 66,
    "temperature": 65
}

CheckError(test_data)