import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Change bg color of time (in days)
// elapsed from the last professor comment
// on the latest commit (main branch)
export function outdatedColor(nrDays) {
    if(nrDays >= 0) {
        let dayPercent = 255 * 0.1;
        let red = 0, green = 255;
    
        red += Math.round(nrDays * dayPercent);
        green -= Math.round(nrDays * dayPercent);
    
        if(red > 255)
            red = 255
        if(green < 0)
            green = 0
    
        red = red.toString(16).padStart(2, '0');
        green = green.toString(16).padStart(2, '0');

        let colorString = ['#', red, green, '00'].join('');
        return {backgroundColor: colorString, color: 'black'};
    }
    else if(nrDays == -1 || nrDays == -3) {
        return {backgroundColor: '#A0A0A0', color: 'black'};
    } else
        return {backgroundColor: '#00FF00', color: 'black'};
}

export function projectStatusText(time) {
    var text;

    switch(time) {
        case -1:
            text = <div className="outdated" style={outdatedColor(time)}>
                <span>Necomentat</span>
            </div>
            break;
        case -2:
            text = <div className="outdated" style={{backgroundColor: '#00FF00'}}>
                <FontAwesomeIcon icon={faCheck} color='black'/>
            </div>
            break;
        case -3:
            text = <div className="outdated" style={outdatedColor(time)}>
                prea vechi
            </div>
            break;
        default:
            text = <div className="outdated" style={outdatedColor(time)}>
                {time} zile
            </div>
            break;
    }

    return text;
}