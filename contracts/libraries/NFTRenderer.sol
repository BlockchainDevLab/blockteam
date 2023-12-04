// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

library NFTRenderer {

    struct RenderParams {
        string unitPrice;
        uint256 amount;
        string fee;
        string maturityDate;
        string code;
        string codeISIN;
        string nameBonds;
    }

    function render(
        RenderParams memory params
    ) public pure returns (string memory) {
        string memory image = string.concat(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 480'>",
            "<style>.codes { font: bold 16px sans-serif; }",
            ".name { font: normal 10px sans-serif; }",
            ".tick { font: normal 18px sans-serif; }</style>",
            renderBackground("XXXXX", 1 , 2),
            renderTop(params.code, params.codeISIN, params.nameBonds),
            renderBottom(params.unitPrice, params.amount, params.fee, params.maturityDate),
            "</svg>"
        );

        return image;
    }

    function renderBackground(
        string memory owner,
        int24 lowerTick,
        int24 upperTick
    ) internal pure returns (string memory background) {
        bytes32 key = keccak256(abi.encodePacked(owner, lowerTick, upperTick));
        uint256 hue = uint256(key) % 360;

        background = string.concat(
            '<rect width="300" height="480" fill="hsl(',
            Strings.toString(hue),
            ',40%,40%)"/>',
            '<rect x="30" y="30" width="240" height="420" rx="15" ry="15" fill="hsl(',
            Strings.toString(hue),
            ',100%,50%)" stroke="#000"/>'
        );
    }

    function renderTop(
        string memory code,
        string memory codeISIN,
        string memory name
    ) internal pure returns (string memory top) {
        top = string.concat(
            '<rect x="30" y="87" width="240" height="42"/>',
            '<text x="39" y="120" class="codes" fill="#fff">',
            code,
            "/",
            codeISIN,
            "</text>"
            '<rect x="30" y="132" width="240" height="30"/>',
            '<text x="39" y="120" dy="36" class="name" fill="#fff">',
            name,
            "</text>"
        );
    }

    function feeToText(
        uint256 fee
    ) internal pure returns (string memory feeString) {
        if (fee == 500) {
            feeString = "0.05%";
        } else if (fee == 3000) {
            feeString = "0.3%";
        }
    }


    function renderBottom(
        string memory unitPrice,
        uint256 amount,
        string memory fee,
        string memory maturityDate
    ) internal pure returns (string memory bottom) {
        bottom = string.concat(
            '<rect x="30" y="282" width="240" height="24"/>',
            '<text x="39" y="300" class="tick" fill="#fff">Unit price: ',
            unitPrice , 
            "</text>",
            '<rect x="30" y="312" width="240" height="24"/>',
            '<text x="39" y="330" class="tick" fill="#fff">Amount: ',
            Strings.toString(amount),
            "</text>",
            '<rect x="30" y="342" width="240" height="24"/>',
            '<text x="39" y="360" class="tick" fill="#fff">Fee: ',
             fee,
            "</text>",
            '<rect x="30" y="372" width="240" height="24"/>',
            '<text x="39" y="360" dy="30" class="tick" fill="#fff">Maturity date: ',
            maturityDate,
            "</text>"
        );
    }

    function tickToText(
        int24 tick
    ) internal pure returns (string memory tickString) {
        tickString = string.concat(
            tick < 0 ? "-" : "",
            tick < 0
                ? Strings.toString(uint256(uint24(-tick)))
                : Strings.toString(uint256(uint24(tick)))
        );
    }
}
